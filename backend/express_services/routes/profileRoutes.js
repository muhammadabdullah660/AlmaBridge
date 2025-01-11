const express = require('express');
const multer = require('multer');
const {createUserProfile, getUserProfile,updateUserProfile,deleteUserProfile} = require('../controllers/userProfileController');
//const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Specify the upload directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });


//User Profile Routes
router.post('/create', upload.single('resume'), createUserProfile);
router.get('/get/:id', getUserProfile);
router.put('/update/:id',upload.single('resume'), updateUserProfile);
router.delete('/delete/:id', deleteUserProfile);

module.exports = router;
