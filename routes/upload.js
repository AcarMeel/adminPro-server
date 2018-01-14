const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var fs = require('fs'); // file system

const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');

// middleware default options
app.use(fileUpload());


app.put('/:type/:id', (req, res) => {
    invalidFile(req.files, res);
    ///====================================
    //   Variables here
    //====================================
    // Collection Type: users, doctors or hospitals
    var type = req.params.type;
    // Id of user, doctor or hospital
    var id = req.params.id;
    // File uploaded by user
    var newFile = req.files.image;
    var file_split = newFile.name.split('.');
    var file_extension = file_split[file_split.length - 1];
    // Allowed extensions
    const validFileExtension = ['jpg','jpeg','png','gif','svg'];
    // Allowed collection types
    const validColTypes = ['users','doctors','hospitals'];

    // Check if extension is valid. Check if url is correct
    invalidTypeOrExt(res, file_extension, validFileExtension, type, validColTypes, id);

    // Personalize file name to be unique
    let renameFile = `${id}-${new Date().getMilliseconds()}.${file_extension}`;
    // Assign file to corresponding collection
    assignFile(id, type, renameFile, res, validColTypes, newFile);


});

function invalidFile(req, res) {
    if (!req) {
        return res.status(400).json({
            ok: false,
            msg: 'It seems like you did not upload an image'
        });
    }
}

function invalidTypeOrExt(res, file_extension, validFileExtension, type, validColTypes, id) {
    if(validColTypes.indexOf(type) < 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'The url is wrong. ' + type + ' is not a valid collection'
        });
    }
    if (!id) {
        return  res.status(400).json({
            ok: false,
            msg: 'No ID was provided'
        });
    }
    if(validFileExtension.indexOf(file_extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            msg: 'The file extension ' + file_extension + ' is not valid'
        });
    }
}

function moveFile(res,newFile, type, renameFile) {
    // Move file to a valid path
    var path = `./uploads/${type}/${renameFile}`;
    newFile.mv(path, err => {
        if(err) {
           return res.status(500).json({
                ok: false,
                msg: `Error moving file to path ${path}`,
                error: err
            });
        }
    });
}

function assignFile(id, type, renameFile, res, validColTypes, newFile) {
    if(type === validColTypes[0]) {
        User.findById(id, (err, foundUser) => {
            if(err) {
                return  res.status(404).json({
                    ok: false,
                    msg: 'This user was not found '
                });
            } else {
                var oldPath = `./uploads/users/${foundUser.img}`;
                if(fs.existsSync(oldPath)) {
                    fs.unlink(oldPath);
                }
                foundUser.img = renameFile;
                foundUser.save((err, updatedUser) => {
                    if(err) {
                        return res.status(404).json({
                            ok: false,
                            msg: 'Image update failed '
                        });
                    } else {
                        // Move file
                        moveFile(res, newFile, type, renameFile);
                        return res.status(200).json({
                            ok: true,
                            msg: `A new image for ${foundUser.name} was updated successfully`,
                            user: updatedUser
                        });
                    }
                });
            }

        });
    }
    if(type === validColTypes[1]) {
        Doctor.findById(id, (err, foundDoctor) => {
            if(err) {
                return res.status(404).json({
                    ok: false,
                    msg: 'This Doctor was not found '
                });
            } else {
                var oldPath = `./uploads/doctors/${foundDoctor.img}`;
                if(fs.existsSync(oldPath)) {
                    fs.unlink(oldPath);
                }
                foundDoctor.img = renameFile;
                foundDoctor.save((err, updatedDoctor) => {
                    if(err) {
                        return res.status(404).json({
                            ok: false,
                            msg: 'Image update failed for doctor ' + foundDoctor.name
                        });
                    } else {
                        moveFile(res,newFile, type, renameFile);
                        return res.status(200).json({
                            ok: true,
                            msg: `A new image for ${foundDoctor.name} was updated successfully`,
                            doctor: updatedDoctor
                        });
                    }
                });
            }
        });
    }
    if(type === validColTypes[2]) {
        Hospital.findById(id, (err, foundHospital) => {
            if(err) {
               return res.status(404).json({
                    ok: false,
                    msg: 'This Hospital was not found '
                });
            } else {
                var oldPath = `./uploads/hospitals/${foundHospital.img}`;
                if(fs.existsSync(oldPath)) {
                    fs.unlink(oldPath);
                }
                foundHospital.img = renameFile;
                foundHospital.save((err, updatedHospital) => {
                    if(err) {
                        return res.status(404).json({
                            ok: false,
                            msg: 'Image update failed for Hospital ' + foundHospital.name
                        });
                    } else {
                        moveFile(res,newFile, type, renameFile);
                        return res.status(200).json({
                            ok: true,
                            msg: `A new image for ${foundHospital.name} was updated successfully`,
                            hospital: updatedHospital
                        });
                    }
                });
            }
        });
    }
}

module.exports = app;