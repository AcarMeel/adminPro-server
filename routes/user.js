var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var User = require('../models/user');


//====================================
//   Gets all users from DB
//====================================
app.get('/', (req, res) => {
    User.find({},'name email role').exec((err, users) => {
    if(err) {
        return res.status(500).json({
            ok: false,
            msg: 'Error loading users',
            errors: err
        });
    }
    res.status(200).json({
        ok: true,
        data: users
    })
});
});

//====================================
//   Post an user
//====================================
app.post('/', (req, res) => {
    var body = req.body;
    var newUser = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    newUser.save((err, savedUser) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error saving user',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            msg: 'User was created',
            data: savedUser
        });
    });

    res.status(200).json({
        ok: true,
        body: body
    });
});

module.exports = app;