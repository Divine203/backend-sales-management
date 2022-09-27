const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register // localhost:3000/users/register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        products: []
    });
    
    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: "Failed to register user"})
        } else { 
            res.json({success: true, msg: "User registered"})
        }
    });
}); 




// Authenticate
/*
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}
*/
router.post('/authenticate', (req, res, next) => {
//    res.send('AUTHENTICATE');
    const username = req.body.username;
    const password = req.body.password;
    
    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){ // checking if the username doesn't exist
            return res.json({success: false, msg: "User not found"});
        }
        // if it exists we compare password
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) { // if it is a match
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                
                res.json({
                    success: true,
                    token: `JWT ${token}`,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        products: user.products
                    }
                });
            } else { // if it's not a match
                return res.json({success: false, msg: "Wrong password"});
            }
        });
    });
});

// Profile (add the "passport.authenticate.." param to protect a router)
router.get('/profile', (req, res, next) => {
//    res.send('PROFILE');   
    res.json({user: req.user});
});



module.exports = router;