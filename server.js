const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const post = require('./routes/api/post.js');

const app = express();

const mongoose = require('mongoose');
// D config
const db = require('./config/keys').mongoURI;
// connect to mongodb
mongoose
    .connect(db)
    .then(() => console.log('MongoDB is Connected'))
    .catch(err => console.log('the error is ---->>', err.message))

//passport middleware
app.use(passport.initialize());
//passport Config
require('./config/passport.js')(passport);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// user routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/post', post);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
