const express = require('express');
const {createJobPosting, getAllJobPosting, updateJobPosting, deleteJobPosting} = require('../controllers/jobPostingContoller')
const {verifyToken} = require('../middlewares/authMiddleware'); 
const rateLimit = require("express-rate-limit");
const { check } = require("express-validator");


const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});



//Job Posting Routes
router.post(
    '/job',
    [
        check("jobName", "jobName is required").exists(),
        check("jobDescription", "jobDescription is required").exists(),
    ],
    limiter,
    verifyToken,
    createJobPosting
);

// Get Job Posts Route
router.get('/jobs',limiter, getAllJobPosting);

// Update Job Post Route
router.put(
    '/job/:id',
    [
        check("jobName", "jobName is required").exists(),
        check("jobDescription", "jobDescription is required").exists(),
    ],
    limiter,
    verifyToken,
    updateJobPosting
);

// Delete Job Post Route
router.delete(
    '/job/:id',
    limiter,
    verifyToken,
    deleteJobPosting
);

module.exports = router;
