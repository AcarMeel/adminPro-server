var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var User = require('../models/user');
var mdAuthentication = require('../middleware/authentication');


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
app.post('/', mdAuthentication.verifyToken, (req, res) => {
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

//====================================
//   Update user
//====================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, foundUser) => {
        if(err || !foundUser) {
            return res.status(500).json({
                ok: false,
                msg: 'Error finding the user',
                errors: err
            });
        }
        // Assign new values
        foundUser.name = body.name;
        foundUser.email = body.email;
        foundUser.role = body.role;
        // Save new values
        foundUser.save((err, savedUser) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error updating the user',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                msg: 'User was updated successfully',
                data: savedUser
            });
        });
    });
});

//====================================
//   Delete user
//====================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    User.findByIdAndRemove(id, (err, removedUser) => {
        if(err || !removedUser) {
            return res.status(500).json({
                ok: false,
                msg: 'Error deleting the user',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'User was removed successfully',
            data: removedUser
        });
    });
});

module.exports = app;