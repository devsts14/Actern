const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  Location: { type: String,default:'' },
  bio: { type: String,default:'' },
  websites: {
    web1: {
      type: String,
      default:''
    },
    web2: {
      type: String,
      default:''
    },
  },
  social: {
    youtube: { type: String,default:'' },
    twitter: { type: String,default:'' },
    facebook: { type: String,default:'' },
    instagram: { type: String,default:'' },
  },
  follower: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: { type: String },
      avatar: { type: String }
    }
  ],
  following: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: { type: String },
      avatar: { type: String }
    }
  ],
  posts: { type: String,default:0 },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
