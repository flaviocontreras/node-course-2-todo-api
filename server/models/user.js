var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    minlength: 1,
    trim: true,
    required: true
  }
});

// var user = new User({
//   email: 'flavio@example.com'
// });
//
// user.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save User', e);
// });

module.export = {
  User
};
