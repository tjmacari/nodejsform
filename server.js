// Dependencies
const express     = require('express');
const bodyParser  = require('body-parser'); // Express can't handle reading data from form element on it's own
const mongoose    = require('mongoose'); // Object modeling package which is best NodeJS schema module

var User = require('./models/usermodel');

// Init express
const app = express();

// Init database
const url = 'mongodb://localhost:27017/test';
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {

    // Clear out database
    //db.dropDatabase();

    // Start our localhost server on port 3000
    app.listen(3000, function() {
        console.log('Server running on 127.0.0.1:3000');
    });
});

/*
 'use' commend from express let's us use middleware like bodyParser so request can be changed before being handled
 by our app.
 Place this BEFORE any CRUD handlers.
 'urlencoded' states to extract data from <form> and add to body prop in req object
*/
app.use(bodyParser.urlencoded({extended: true}));

// Static content (like CSS) in public folder
app.use(express.static(__dirname + '/public'));

// Replace 'function(req, res) {' with ES6 arrow '(req, res) => {'
app.get('/', (req, res) => {
    // __dirname contact JS source code
    res.sendFile(__dirname + '/index.html');
});

app.get('/users', (req, res) => {
    // toArray gives us a callback for loading data
    db.collection('users').find().toArray(function(err, results) {
        if(err) return console.log(err);

        res.status(200).send(results);
    });
});

app.post('/newuser', (req, res) => {
    var user = new User(req.body);

    user.save(function(err) {
        if(err) throw err;
        console.log('Saved: ', user);
        res.json(user);
    });
});

app.delete('/deleteuser', (req, res) => {

    var userId = req.body.id;
    console.log(userId);

    // Search schema for '_id' prop
    User.findById(userId, function(err, user) {
        if(err) throw err;

        console.log(user);

        user.remove(function(err) {
            if(err) throw err;

            res.send({
                message: 'User Deleted',
                id: user._id
            })
        });
    });
});

