const User = require('../models/User');
const Profile = require('../models/Profile');

exports.profile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user._id,
    }).populate('user', ['name', 'avatar', 'email']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.profileCreate = async (req, res) => {
  const {
    location,
    bio,
    web1,
    web2,
    youtube,
    twitter,
    facebook,
    instagram,
    follower,
    following,
    posts,
  } = req.body;

  // build profile object
  const profileFields = {};
  profileFields.user = req.user._id;

  profileFields.bio = bio;
  if (location) profileFields.location = location;

  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (twitter) profileFields.social.twitter = twitter;

  profileFields.websites = {};
  if (web1) profileFields.websites.web1 = web1;
  if (web2) profileFields.websites.web2 = web2;

  try {
    let profile = Profile.findOne({ user: req.user._id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.allProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [
      'name',
      'avatar',
      'email',
    ]);
    res.json(profiles);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.singleUserProfile = async (req, res) => {
  try {
    const profile = await Profile.find({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.status(500).send('Server error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // remove profile
    await Profile.findOneAndRemove({ user: req.user._id });
    // remove user
    await User.findOneAndRemove({ _id: req.user._id });

    res.json({ msg: 'User deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.follow = async (req, res) => {
  const { followId } = req.body;
  const post = await Profile.findOne({ user: followId }).populate('user', [
    'name',
    'avatar',
    'email',
  ]);
  const user = await Profile.findOne({ user: req.user._id }).populate('user', [
    'name',
    'avatar',
    'email',
  ]);
  try {
    if (
      user.following.filter((like) => like.user.toString() === followId)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Bad request' });
    }
    console.log('hello world');
    const newLike = {
      name: user.user.name,
      avatar: user.user.avatar,
      user: req.user._id,
    };
    post.follower.unshift(newLike);
    await post.save();
    const newFollow = {
      name: post.user.name,
      avatar: post.user.avatar,
      user: followId,
    };
    user.following.unshift(newFollow);
    await user.save();
    res.json({ follower: post.follower, following: user.following });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};
exports.unfollow = async (req, res) => {
  const { followId } = req.body;
  const post = await Profile.findOne({ user: followId });
  const user = await Profile.findOne({ user: req.user._id });
  try {
    if (
      post.follower.filter((like) => like.user.toString() === req.user._id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Bad request' });
    }
    const removeIndex = post.follower
      .map((like) => like.user.toString())
      .indexOf(req.user._id);
    post.follower.splice(removeIndex, 1);
    await post.save();
    const removeIndex1 = user.following
      .map((like) => like.user.toString())
      .indexOf(followId);
    user.following.splice(removeIndex1, 1);
    await user.save();
    res.json({ follower: post.follower, following: user.following });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

// exports.follow=async (req, res)=>{
//   const { followId } = req.body;
//   const userToFollow = await Profile.findOne({ user: followId }).populate('user', [
//     'name',
//     'avatar',
//     'email',
//   ]);
//   const userThatFollows = await Profile.findOne({ user: req.user._id }).populate('user', [
//     'name',
//     'avatar',
//     'email',
//   ]);
// console.log(followId);



// }
