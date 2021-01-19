const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware } = require('../../controllers/auth');
const {profile,profileCreate,allProfiles,singleUserProfile,deleteUser,follow,unfollow } = require('../../controllers/profile');

router.get('/me',requireSignin,profile);
router.post('/',requireSignin,profileCreate);
router.get('/all',requireSignin,allProfiles)
router.get('/user/:user_id',requireSignin,singleUserProfile)
router.delete('/',requireSignin,deleteUser)
router.put('/follow', requireSignin, follow);
router.put('/unfollow', requireSignin, unfollow);


module.exports = router;
