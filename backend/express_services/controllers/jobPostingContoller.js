const JobPosting = require("../models/JobPosting");
const logAction = require("../utils/logService");
const { validationResult } = require('express-validator');
const { handleValidationErrors } = require('../utils/errorHandler');



// Create a Job Posting
const createJobPosting = async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    console.log(req.body);
    await logAction(
        "Job Post Creation Failed",
        null,
        `Validation errors: ${JSON.stringify(errors.array())}`,
        "failure"
    );
    return res.status(status).json(response);
  }

  const { userId, jobName, jobDescription, salaryRange, location, jobType } = req.body;
  try {
    const newJobPosting = await JobPosting.create({
      userId,
      jobName,
      jobDescription,
      salaryRange,
      location,
      jobType,
    });

    await logAction(
      "Job Post Created",
      userId,
      `UserId: ${userId} create a job post successfully`,
    );

    res.status(201).json(newJobPosting);
  } catch (error) {
    await logAction(
      "Job Post Failed",
      userId,
      error.message,
      "failure"
    );
    res.status(500).json({ message: "Error creating job posting", error });
  }
};


const getAllJobPosting = async (req, res) => {
  try {
    const jobs = await JobPosting.findAll();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

const updateJobPosting = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    await logAction(
        "Job Post Updation Failed",
        null,
        `Validation errors: ${JSON.stringify(errors.array())}`,
        "failure"
    );
    return res.status(status).json(response);
  }
  const { userId } = req.body;
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updatedCount, [updatedJobPosting]] = await JobPosting.update(updates, {
      where: { id },
      returning: true
    });

    if (updatedCount === 0) {
      await logAction("Job Post Updation Fail", userId, `Such Job does not Exist in the System`, "failure");
      return res.status(404).json({ message: "Job posting not found" });
    }
    await logAction("Job Post Updated", userId, `UserId: ${userId} has updated the Job Post Successfully`);
    res.status(200).json(updatedJobPosting);
  } catch (error) {
    await logAction("Job Post Updation Fail", userId, error, "failure");
    res.status(500).json({ message: "Error updating job posting", error });
  }
};



const deleteJobPosting = async (req, res) => {

  const { userId } = req.body;
  try {
    const { id } = req.params;

    const deleted = await JobPosting.destroy({
      where: { id },
    });

    if (!deleted) {
      await logAction("Job Post Deletion Fail", userId, `Such Job does not Exist in the System`, "failure");
      return res.status(404).json({ message: "Job posting not found" });
    }

    await logAction("Job Post Deleted", userId, `UserId: ${userId} has deleted the Job Post Successfully`);
    res.status(204).json({ message: "Job posting deleted successfully" });
  } catch (error) {
    await logAction("Job Post Deletion Fail", userId, error, "failure");
    res.status(500).json({ message: "Error deleting job posting", error });
  }
};

module.exports = {
  createJobPosting,
  getAllJobPosting,
  updateJobPosting,
  deleteJobPosting,
};
