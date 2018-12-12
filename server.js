const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('This app is working!!!'));
app.listen(PORT);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://andrzej:endriu17@ds253783.mlab.com:53783/database-1');



//new user Schema
const userSchema = new Schema({
    name: String,
    username: { type: String, required:true, unique: true },
    password: { type: String, required: true},
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

//Mongoose schema method

userSchema.methods.manify = function(next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};


//pre-save method

userSchema.pre('save', function(next) {
    //here we're getting the current time value
    const currentDate = new Date();
  
    //here we're putting the current time into the field
    this.updated_at = currentDate;
  
    if (!this.created_at) {
        this.created_at = currentDate;
    }
  
    //next() is a function that goes into the next hook in order to beeing executed, before or after the request
    next();
  });
  

//model based on userSchema
const User = mongoose.model('User', userSchema);
// the instancies of User's class
const kenny = new User({
    name: 'Kenny',
    username: 'Kenny_the_boy',
    password: 'password'
});

kenny.manify(function(err, name) {
    if (err) throw err;
    console.log('Your new name is: '+ name);
})


const benny = new User({
    name: 'Benny',
    username: 'Benny_the_boy',
    password: 'password'
})

benny.manify(function(err, name) {
    if(err) throw err;
    console.log('Your new name is: '+ name);
})


const mark = new User({
    name: 'Mark',
    username: 'Mark_the_boy',
    password: 'password'
})

mark.manify(function(err, name) {
    if(err) throw err;
    console.log('Your new name is: '+ name);
})


//Find all users
const findAllUsers = function() {
    return User.find({}, function(err, res) {
        if (err) throw err;
        console.log('Actual database records are '+ res);
    });
}

//Find specific record
const findSpecificRecord = function() {
    return User.find({ username: 'Kenny_the_boy' }, function(err, res) {
        if(err) throw err;
        console.log('The record you are looking for is ' + res);
    })
}

//Update user's password
const updateUserPassword = function() {
    return User.findOne({ username: 'Kenny_the_boy' })
        .then(function(user) {
            console.log('Old password is ' + user.password);
            console.log('Name ' + user.name);
            user.password = 'newPassword';
            console.log('New password is ' + user.password);
            return user.save(function(err) {
                if (err) throw err;

                console.log('The user '+ user.name + ' has been successfully updated')
            });
        });
}

//Update user's name
const updateUserName = function() {
    return User.findOneAndUpdate({ username: 'Benny_the_boy' }, { username: 'Benny_the_man' }, { new: true }, function(err, user) {
        if (err) throw err;

        console.log('The user name has been updated to '+ user.username);
    });
}

// Find specific user and delete
const findMarkAndDelete = function() {
    return User.findOne({ username: 'Mark_the_boy' })
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        });
}

const findKennyAndDelete = function() {
    return User.findOne({ username: 'Kenny_the_boy'})
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        });
}

const findBennyAndRemove = function() {
    return User.findOneAndRemove({ username: 'Benny_the_man'})
        .then(function(user) {
          return user.remove(function() {
              console.log('User successfully deleted');
          });
        });
}

Promise.all([kenny.save(), mark.save(), benny.save()])
    .then(findAllUsers)
    .then(findSpecificRecord)
    .then(updateUserPassword)
    .then(updateUserName)
    .then(findMarkAndDelete)
    .then(findKennyAndDelete)
    .then(findBennyAndRemove)
    .catch(console.log.bind(console))