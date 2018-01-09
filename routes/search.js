var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

//=============================
// search by collection 
//=============================
app.get('/collection/:table/:filter', (req, res)=> {
    var filter = req.params.filter;
    var table = req.params.table;
    var promise;
    switch(table) {
        case 'users':
            promise = findUsers(filter, regex);
            break;
        case 'doctors':
            promise = findDoctors(filter, regex);
            break;
        case 'hospitals':
            promise = findHospitals(filter, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'The filter do not correspond to any of the collections'
            });
            
    }

    Promise.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    })

})

//=============================
// general search
//=============================
app.get('/all/:filter', (req, res, next) => {
    var filter = req.params.filter;
    var regex = new RegExp(filter, 'i');

    Promise.all([
        findHospitals(filter, regex),
        findDoctors(filter, regex),
        findUsers(filter, regex)
    ])
    .then(results => {
        res.status(200).json({
            ok: true,
            hospitals: results[0],
            doctors: results[1],
            users: results[2] 
        });
    })
});

function findHospitals(filter, regex) {
    return new Promise( (resolve, reject) => {
     Hospital.find({ name: regex}) 
        .populate('user', 'name email')
        .exec((err, hospitals) => {
            if(err) {
                reject('Error ocurred while retrieving Hospitals data');
            } else {
                resolve(hospitals);
            }
     });
    });
}

function findDoctors(filter, regex) {
    return new Promise( (resolve, reject) => {
     Doctor.find({ name: regex})
     .populate('user', 'name email')
     .populate('hospital', 'name')
      .exec((err, doctors) => {
         if(err) {
             reject('Error ocurred while retrieving Doctors data');
         } else {
             resolve(doctors);
         }
     });
    });
}

function findUsers(filter, regex) {
    return new Promise( (resolve, reject) => {
     User.find({}, 'name email').or([{ 'name': regex}, {'email': regex}]) 
         .exec((err, users) => {
            if(err) {
                reject('Error ocurred while retrieving Users data');
            } else {
                resolve(users);
            }
        });
    });
}

module.exports = app;