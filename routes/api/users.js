const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport')
// load User model
const User = require('../../models/User.js');

// @route GET api/users/test
// @desv Tests users route
// @access Public
router.get('/test', (req, res) => {
  res.json({
    msg: 'User works'
  })
})

// @route POST api/users/register
// @desv Register user
// @access Public
router.post('/register', (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'Email already exists'
        });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err, '<----- this is the error'));
          })
        })
      }
    })
})

// @route POST api/users/login
// @desv Login user
// @access Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by Email
  User.findOne({
      email
    })
    .then(user => {
      //check for users
      if (!user) {
        return (
          res.status(404).json({
            email: 'user not found'
          })
        )
        //check password
      } else {
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              //user mathced
              //create JWT payload: all the elements we want to display after sign in
              const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                email: user.email
              }
              //sign token: passing the payload, the secretKey and the expire when the user will be logout automatically(3600=== 1hour)
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) =>{
                  res.json({
                    success: true,
                    token: 'Bearer' + token,
                  })
                }
              );

            } else {
              return (
                res.json({
                  status: 400,
                  password: 'password incorrect'
                })
              )
            }
          })
      }

    })
})

// @route GET api/users/current
// @desv Return current user
// @access Private
router.get('/current',passport.authenticate('jwt', {session: false}),(req, res) =>{
  res.json({
    msg: 'success'
  });
})






module.exports = router;
