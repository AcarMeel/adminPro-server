var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');


app.get('/all/:filter', (req, res, next) => {
    var filter = req.params.filter;
    var regex = new RegExp(filter, 'i');
    res.send('Hello');
});

module.exports = app;