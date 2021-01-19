const express = require('express');
const router = express.Router();

// import validators
const { textValidator } = require('../../validators/auth');

const { runValidation } = require('../../validators');

// import controller
const { requireSignin, adminMiddleware } = require('../../controllers/auth');

const {
  makePost,
  getPosts,
  getSinglePost,
  deleteSinglePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment,
  getAllPosts,
  makeTextPost,
  getUserP
} = require('../../controllers/post');

router.post('/', requireSignin, makePost);
router.post('/text',requireSignin, makeTextPost);
router.get('/', requireSignin, getPosts);
router.get('/u/:id', requireSignin, getUserP);
router.get('/all',requireSignin,getAllPosts);
router.get('/:id', requireSignin, getSinglePost);
router.delete('/:id', requireSignin, deleteSinglePost);
router.put('/like/:id', requireSignin, likePost);
router.put('/unlike/:id', requireSignin, unlikePost);
router.post('/comment/:id', requireSignin, commentPost);
router.delete('/comment/:id/:comment_id', requireSignin, deleteComment);

module.exports = router;
