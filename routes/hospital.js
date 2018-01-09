var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Hospital = require('../models/hospital');
var mdAuthentication = require('../middleware/authentication');


//====================================
//   Gets all hospitals from DB
//====================================
app.get('/', (req, res) => {
    Hospital.find({})
    .populate('user', 'name email')
    .exec((err, hospitals) => {
    if(err) {
        return res.status(500).json({
            ok: false,
            msg: 'Error loading hospitals',
            errors: err
        });
    }
    res.status(200).json({
        ok: true,
        data: hospitals
    })
});
});

//====================================
//   Post an hospital
//====================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;
    var newHospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    newHospital.save((err, savedHospital) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error saving hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            msg: 'Hospital was created',
            data: savedHospital
        });
    });

    res.status(200).json({
        ok: true,
        body: body
    });
});

//====================================
//   Update hospital
//====================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, foundHospital) => {
        if(err || !foundHospital) {
            return res.status(500).json({
                ok: false,
                msg: 'Error finding the hospital',
                errors: err
            });
        }
        // Assign new values
        foundHospital.name = body.name;
        foundHospital.user = req.user._id;
        // Save new values
        foundHospital.save((err, savedHospital) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error updating the hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                msg: 'Hospital was updated successfully',
                data: savedHospital
            });
        });
    });
});

//====================================
//   Delete hospital
//====================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, removedHospital) => {
        if(err || !removedHospital) {
            return res.status(500).json({
                ok: false,
                msg: 'Error deleting the hospital',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'Hospital was removed successfully',
            data: removedHospital
        });
    });
});

module.exports = app;