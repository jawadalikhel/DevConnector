const express = require('express');
const app = express();
const mongoose = require('mongoose');

// D config
const db = require('./config/keys').mongoURI;
// connect to mongodb 
mongoose
    .connect(db)
    .then(() => console.log('MongoDB is Connected'))
    .catch(err => console.log('the error is ---->>', err.message))

app.get('/', (req, res) => {
    res.send('helloo')
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})