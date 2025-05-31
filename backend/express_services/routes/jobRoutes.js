const express = require('express');
const {createJobPosting, getAllJobPosting, updateJobPosting, deleteJobPosting, submitJobApplication} = require('../controllers/jobPostingContoller')
const {verifyToken} = require('../middlewares/authMiddleware'); 
const rateLimit = require("express-rate-limit");
const { check } = require("express-validator");
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });


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


router.post('/job/apply', limiter, upload.single('resume'), [
    check('linkedin')
      .optional()
      .isURL()
      .withMessage('Invalid LinkedIn URL'),
    check('github')
      .optional()
      .isURL()
      .withMessage('Invalid GitHub URL'),
    check('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 5000 })
      .withMessage('Description must not exceed 5000 characters'),
  ], submitJobApplication);


module.exports = router;
