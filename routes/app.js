var express = require('express');
var app = express();


app.get('/', (req, res, next) => {
    res.send('Hello');
});

module.exports = app;