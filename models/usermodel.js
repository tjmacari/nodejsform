const mongoose = require('mongoose'); // Object modeling package which is best NodeJS schema module
var Schema =mongoose.Schema;

// Define schema
var userSchema = new Schema({
    uid: String,
    first: String,
    last: String,
    address: String,
    zip: Number,
    phone: String,
    email: String,
    created_at: Date,
    updated_at: Date
});

// On each save, run this func first to add/update the date
userSchema.pre('save', function(next) {
    var currDate = new Date();
    this.updated_at = currDate;
    if(!this.created_at)
        this.created_at = currDate;
    next(); // continue to save
});

// Model for schema
var User = mongoose.model('User', userSchema);

// Expose for Node app
module.exports = User;