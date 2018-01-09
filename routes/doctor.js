var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Doctor = require('../models/doctor');
var mdAuthentication = require('../middleware/authentication');


//====================================
//   Gets all doctors from DB
//====================================
app.get('/', (req, res) => {
    Doctor.find({}).exec((err, doctors) => {
    if(err) {
        return res.status(500).json({
            ok: false,
            msg: 'Error loading doctors',
            errors: err
        });
    }
    res.status(200).json({
        ok: true,
        data: doctors
    })
});
});

//====================================
//   Post an doctor
//====================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;
    var newDoctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    newDoctor.save((err, savedDoctor) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error saving doctor',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            msg: 'Doctor was created',
            data: savedDoctor
        });
    });

    res.status(200).json({
        ok: true,
        body: body
    });
});

//====================================
//   Update doctor
//====================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (err, foundDoctor) => {
        if(err || !foundDoctor) {
            return res.status(500).json({
                ok: false,
                msg: 'Error finding the doctor',
                errors: err
            });
        }
        // Assign new values
        foundDoctor.name = body.name;
        foundDoctor.user = req.user._id;
        foundDoctor.hospital = body.hospital;
        
        // Save new values
        foundDoctor.save((err, savedDoctor) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error updating the doctor',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                msg: 'Doctor was updated successfully',
                data: savedDoctor
            });
        });
    });
});

//====================================
//   Delete doctor
//====================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    Doctor.findByIdAndRemove(id, (err, removedDoctor) => {
        if(err || !removedDoctor) {
            return res.status(500).json({
                ok: false,
                msg: 'Error deleting the doctor',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'Doctor was removed successfully',
            data: removedDoctor
        });
    });
});

module.exports = app;