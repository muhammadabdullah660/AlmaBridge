const express = require('express');
const {createJobPosting, getJobPostingById, updateJobPosting, deleteJobPosting} = require('../controllers/jobPostingContoller')

const router = express.Router();


//Job  Posting Routes
router.post('/create', createJobPosting);
router.get('/get/:id', getJobPostingById);
router.put('/update/:id',updateJobPosting);
router.delete('/delete/:id', deleteJobPosting);

module.exports = router;
