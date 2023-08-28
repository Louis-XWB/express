const mongoose = require('mongoose');
const { mongopath } = require('../config/config.default');

async function main() {
  try {
    await mongoose.connect(mongopath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.log(err);
    console.log('Connected to MongoDB failed');
  }
}

main();

module.exports = {
  User: mongoose.model('User', require('./userModel')),
  Video: mongoose.model('Video', require('./videoModel')),
  Subscribe: mongoose.model('Subscribe', require('./subscribeModel')),
  Videocomment: mongoose.model('Comment', require('./videocommentModel')),
  Videolike: mongoose.model('Like', require('./videolikeModel')),
  VideoCollection: mongoose.model('Collection', require('./collectionModel')),
}