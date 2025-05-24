const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');
const { createEvent, updateEvent, deleteEvent, getEvents, trackAttendance } = require('../controllers/eventController');

const eventValidation = [
  check('title').notEmpty().withMessage('Title is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('date').isISO8601().withMessage('Valid date is required'),
  check('targetAudience').isIn(['students', 'alumni', 'both']).withMessage('Invalid target audience'),
];

const attendanceValidation = [
  check('userId').notEmpty().withMessage('User ID is required'),
];

router.post('/event', verifyToken, eventValidation, createEvent);

router.put('/event/:id', verifyToken, eventValidation, updateEvent);

router.delete('/event/:id', verifyToken, deleteEvent);

router.get('/event', verifyToken, getEvents);

router.post('/event/:id/attend', verifyToken, attendanceValidation, trackAttendance);

module.exports = router;