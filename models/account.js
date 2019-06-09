var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    name: String,
});

Account.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();

    console.log('making hash...........');
    bcrypt.genSalt(4, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

Account.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);