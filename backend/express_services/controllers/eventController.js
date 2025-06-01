const Event = require("../models/Event");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { handleValidationErrors } = require('../utils/errorHandler');
const emailQueue = require("../utils/queue");
const sequelize = require("../config/database");
const logAction = require("../utils/logService");
const { v4: uuidv4 } = require('uuid');

const handleError = async (res, error, action, userId = null) => {
  await logAction(action, userId, error.message, "failure");
  return res.status(500).json({ message: "Server error", error: error.message });
};

// Create Event
const createEvent = async (req, res) => {
  const { userId } = req.body;  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    await logAction(
      "Event Creation Failed",
      userId,
      `Validation errors: ${JSON.stringify(errors.array())}`,
      "failure"
    );
    return res.status(status).json(response);
  }

  const { title, description, date,eventLink, targetAudience } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.create({
      id: uuidv4(),
      title,
      description,
      date,
      eventLink,
      createdBy: userId,
      status: 'pending',
      targetAudience,
    }, { transaction });

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      await logAction("Event Creation Failed", userId, "User not found", "failure");
      return res.status(404).json({ message: "User not found" });
    }

    await emailQueue.add({
      userId: userId,
      email: user.email,
      type: 'event_creation',
      eventId: event.id,
      eventTitle: title,
    });


    await transaction.commit();
    await logAction(
      "Event Creation",
      userId,
      `New event created: ${title}`,
      "success"
    );

    return res.status(201).json({
      message: "Event created successfully.",
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        eventLink: event.eventLink,
        status: event.status,
        targetAudience: event.targetAudience,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleError(res, error, "Event Creation Failed", userId);
  }
};

// Update Event
const updateEvent = async (req, res) => {
  const { userId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    await logAction(
      "Event Update Failed",
      userId,
      `Validation errors: ${JSON.stringify(errors.array())}`,
      "failure"
    );
    return res.status(status).json(response);
  }

  const { id } = req.params;
  const { title, description, date, eventLink, status, targetAudience } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findByPk(id, { transaction });
    if (!event) {
      await transaction.rollback();
      await logAction("Event Update Failed", userId, `Event not found: ${id}`, "failure");
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy !== userId) {
      await transaction.rollback();
      await logAction("Event Update Failed", userId, `Unauthorized update attempt on event: ${id}`, "failure");
      return res.status(403).json({ message: "Unauthorized" });
    }

    await event.update({
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      eventLink: eventLink || event.eventLink,
      status: status || event.status,
      targetAudience: targetAudience || event.targetAudience,
    }, { transaction });

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      await logAction("Event Update Failed", userId, "User not found", "failure");
      return res.status(404).json({ message: "User not found" });
    }

    await emailQueue.add({
      userId: userId,
      email: user.email,
      type: 'event_update',
      eventId: event.id,
      eventTitle: event.title,
    });

    await transaction.commit();
    await logAction(
      "Event Update",
      userId,
      `Event updated: ${event.title}`,
      "success"
    );

    return res.status(200).json({
      message: "Event updated successfully.",
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
       eventLink: event.eventLink,
        status: event.status,
        targetAudience: event.targetAudience,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleError(res, error, "Event Update Failed", userId);
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findByPk(id, { transaction });
    if (!event) {
      await transaction.rollback();
      await logAction("Event Deletion Failed", userId, `Event not found: ${id}`, "failure");
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy !== userId) {
      await transaction.rollback();
      await logAction("Event Deletion Failed", userId, `Unauthorized deletion attempt on event: ${id}`, "failure");
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      await logAction("Event Deletion Failed", userId, "User not found", "failure");
      return res.status(404).json({ message: "User not found" });
    }

    await emailQueue.add({
      userId: userId,
      email: user.email,
      type: 'event_deletion',
      eventId: event.id,
      eventTitle: event.title,
    });

    await event.destroy({ transaction });

    await transaction.commit();
    await logAction(
      "Event Deletion",
      userId,
      `Event deleted: ${event.title}`,
      "success"
    );

    return res.status(204).json({ message: "Event deleted successfully." });
  } catch (error) {
    await transaction.rollback();
    return handleError(res, error, "Event Deletion Failed", userId);
  }
};

// Get All Events
const getEvents = async (req, res) => {
  const { userId } = req.body;
  try {
    const events = await Event.findAll({
      attributes: ['id', 'title', 'description', 'date', 'eventLink', 'status', 'targetAudience', 'createdBy'],
    });

    await logAction(
      "Events Retrieval",
      userId,
      `Retrieved ${events.length} events`,
      "success"
    );

    return res.status(200).json(events);
  } catch (error) {
    return handleError(res, error, "Events Retrieval Failed", userId);
  }
};

// Track Attendance
const trackAttendance = async (req, res) => {
  const { userId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    await logAction(
      "Event Attendance Tracking Failed",
      userId,
      `Validation errors: ${JSON.stringify(errors.array())}`,
      "failure"
    );
    return res.status(status).json(response);
  }

  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findByPk(id, { transaction });
    if (!event) {
      await transaction.rollback();
      await logAction("Event Attendance Tracking Failed", userId, `Event not found: ${id}`, "failure");
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      await logAction("Event Attendance Tracking Failed", userId, "User not found", "failure");
      return res.status(404).json({ message: "User not found" });
    }

    // Simplified attendance tracking (consider a separate EventAttendance table for production)
    await emailQueue.add({
      userId: userId,
      email: user.email,
      type: 'event_attendance',
      eventId: event.id,
      eventTitle: event.title,
      attendeeId: userId,
    });

    await transaction.commit();
    await logAction(
      "Event Attendance Tracking",
      userId,
      `User ${userId} registered for event: ${event.title}`,
      "success"
    );

    return res.status(200).json({ message: "Attendance tracked successfully." });
  } catch (error) {
    await transaction.rollback();
    return handleError(res, error, "Event Attendance Tracking Failed", userId);
  }
};

module.exports = { createEvent, updateEvent, deleteEvent, getEvents, trackAttendance };