var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');


exports.verifyToken = function (req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'incorrect token',
                errors: err
            });
        }
        req.user = decoded.user;
        next();
    });
}