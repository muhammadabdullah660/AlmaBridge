const JobPosting = require("../models/JobPosting");

// Create a Job Posting
const createJobPosting = async (req, res) => {
  try {
    const {
      jobName,
      jobDescription,
      salaryRange,
      location,
      postedById,
      jobType,
    } = req.body;

    const newJobPosting = await JobPosting.create({
      jobName,
      jobDescription,
      salaryRange,
      location, // Directly save location as an array of strings
      postedById,
      jobType,
    });

    res.status(201).json(newJobPosting);
  } catch (error) {
    console.error("Error creating job posting:", error); // Log the error for debugging
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
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await JobPosting.update(updates, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    const updatedJobPosting = await JobPosting.findByPk(id);
    res.status(200).json(updatedJobPosting);
  } catch (error) {
    console.error("Error updating job posting:", error); // Log the error for debugging
    res.status(500).json({ message: "Error updating job posting", error });
  }
};

const deleteJobPosting = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await JobPosting.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.status(200).json({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error("Error deleting job posting:", error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting job posting", error });
  }
};

module.exports = {
  createJobPosting,
  getAllJobPosting,
  updateJobPosting,
  deleteJobPosting,
};
