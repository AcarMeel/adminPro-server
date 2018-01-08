var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var User = require('../models/user');
var SEED = require('../config/config').SEED;


//====================================
//   Login
//====================================
app.post('/', (req, res) => {
    var body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error retrieving user',
                errors: err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'invalid credentials',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                msg: 'invalid credentials',
                errors: err
            });
        }
        userDB.password = 'you cannot see';
        // Create token
        var token = jwt.sign({ user: userDB },SEED, { expiresIn: 14400 });
        return res.status(200).json({
            ok: true,
            loggedUser: userDB,
            token: token,
            id: userDB._id
        });
    })
});




module.exports = app;