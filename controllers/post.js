const User = require('../models/User');
const Profile = require('../models/Profile');
const Post = require('../models/Post');
const c = require('config');

exports.makePost = async (req, res) => {
  const { description, location, imageUrl } = req.body;
  const user = await User.findById(req.user._id);
  try {
    const newPost = new Post({
      description: description,
      imageUrl: imageUrl,
      location: location,
      name: user.name,
      avatar: user.avatar,
      user: req.user._id,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.makeTextPost = async (req, res) => {
  const { text } = req.body;
  const user = await User.findById(req.user._id);
  try {
    const newPost = new Post({
      text: text,
      name: user.name,
      avatar: user.avatar,
      user: req.user._id,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).populate('user', ['name', 'avatar'])
    .populate('likes.user',['name', 'avatar','_id'])
    .populate('comments.user',['name', 'avatar','_id']).sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.getAllPosts = async (req, res) => {
  // try {
  //   const posts = await Post.find().populate('user',['name','avatar']).sort({ date: -1 });
  //   res.json(posts);
  // } catch (error) {
  //   res.status(500).send('Server Error');
  // }

  try {
    const pro = await Profile.find({ user: req.user._id });

    const arr = pro[0].following.map((p) => p.user);
    arr.unshift(req.user._id)
    console.log(arr);
    const post = await Post.find({ user: {$in:arr }})
      .populate('user', ['name', 'avatar'])
      .populate('likes.user',['name', 'avatar','_id'])
      .populate('comments.user',['name', 'avatar','_id'])
      .sort({ date: -1 });

    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', ['name', 'avatar'])
    .populate('likes.user',['name', 'avatar','_id'])
    .populate('comments.user',['name', 'avatar','_id']);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.followingPosts = async (req, res) => {
  try {
    const pro = await Profile.findById(req.user._id);
    const post = await Post.find({
      user: { $in: pro.following.user.map((p) => p.user) },
    });
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.deleteSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.user._id) {
      return res.status(401).json({ msg: 'Not Authorized' });
    }
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    await post.remove();
    const pos = await Post.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ msg: 'Post deleted', pos: pos });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const user = await User.findById(req.user._id);
  try {
    if (
      post.likes.filter((like) => like.user.toString() === req.user._id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Bad request' });
    }
    const newLike = {
      name: user.name,
      avatar: user.avatar,
      user: req.user._id,
    };
    post.likes.unshift(newLike);
    const liked = await Post.findByIdAndUpdate(req.params.id,{$push:{likes:newLike}},{new:true}).populate('user', ['name', 'avatar'])
    .populate('likes.user',['name', 'avatar','_id'])
    .populate('comments.user',['name', 'avatar','_id']).exec()
    // await post.save()
    const likeds=  await Post.findById(req.params.id).populate('user', ['name', 'avatar'])
    .populate('likes.user',['name', 'avatar','_id'])
    .populate('comments.user',['name', 'avatar','_id']);
    res.json(likeds.likes);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user._id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Bad request' });
    }
    // remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user._id);
    post.likes.splice(removeIndex, 1);
    await post.save()
    res.json(post.likes);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.commentPost = async (req, res) => {
  const { comment } = req.body;

  const user = await User.findById(req.user._id);
  const post = await Post.findById(req.params.id);
  try {
    const newComment = {
      comment: comment,
      name: user.name,
      avatar: user.avatar,
      user: req.user._id,
    };
    const liked = await Post.findByIdAndUpdate(req.params.id,{$push:{comments:newComment}},{new:true}).populate('user', ['name', 'avatar'])
    .populate('likes.user',['name', 'avatar','_id'])
    .populate('comments.user',['name', 'avatar','_id']).exec()
    // await post.save()
    const likeds=  await Post.findById(req.params.id).populate('user', ['name', 'avatar'])
    .populate('likes.user',['name', 'avatar','_id'])
    .populate('comments.user',['name', 'avatar','_id']);
    // await post.save();
    res.json(likeds.comments);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // get comment
    const comment = await post.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    if (comment.user.toString() !== req.user._id) {
      return res.status(404).send('server error');
    }
    // remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user._id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.getUserP = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id }).populate('user', ['name', 'avatar'])
    .populate('likes.user',['name', 'avatar','_id'])
    .populate('comments.user',['name', 'avatar','_id']).sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
