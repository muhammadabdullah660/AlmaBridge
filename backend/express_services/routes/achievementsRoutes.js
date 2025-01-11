const express = require('express');
const multer = require('multer');
const {createAchievement,getAllAchievements, updateAchievement, deleteAchievement} = require('../controllers/achievementsController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploadsAchieverPhotos'); // Specify the upload directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });


//User Profile Routes
router.post('/create', upload.single('achieverPicture'), createAchievement);
router.get('/get', getAllAchievements);
router.put('/update/:id',upload.single('achieverPicture'), updateAchievement);
router.delete('/delete/:id', deleteAchievement);

module.exports = router;
