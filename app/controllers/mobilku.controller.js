const {
    mobilkuCreate,
    mobilkuImageCreate,
} = require('../models/mobilku.model');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require("sharp");
const uploadFile = require("../middlewares/upload");

// Create and Save a new vehicle
exports.create = async (req, res) => {
    try {        
        await uploadFile(req, res, function(err) {
            const body = req.body;
            const date = new Date(body.date);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
    
            const user = {
                education: body.education,
                city: body.city,
                mobile: body.mobile,
                age: body.usia,
                birthday: formattedDate,
                name: body.name
            }
    
            // DB Insert
            mobilkuCreate(user, (err, data) => {
                if (err)
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Vehicle."
                    });
                else                    
                    console.log(data);

                    // Define path
                    const path = __basedir + "/resources/assets/uploads/";
            
                    // Array of image size 
                    const thumbnail = [500, 1000];
            
                    // Create a filename
                    const filename = req.file.originalname;
            
                    // Get file extension
                    const ext = filename.split('.')[1];
            
                    // Create a new filename for reseized image
                    let newName = crypto.randomBytes(8).toString('hex');
            
                    // Generate thumbnail
                    thumbnail.forEach(size => {
                        // New file fullpath
                        let imageFullpath = data.id + "_" + newName + "_" + size + "." + ext
            
                        // Create a new resized image
                        sharp(path + filename)
                            .resize({
                                height: size
                            })
                            .toFile(path + imageFullpath)
            
                        // Data to be stored into database
                        let userImage = {
                            mobilku_id: data.id,
                            path: imageFullpath,
                            size: size
                        };
            
                        // DB Insert Image
                        mobilkuImageCreate(userImage, (err, data) => {
                            if (err)
                                res.status(500).send({
                                    message: err.message || "Some error occurred while creating the Vehicle."
                                });
                            // else res.send(data);
                        });
                    });
            
                    res.send({
                        message: "Uploaded the file successfully: " + filename,
                    });
            });

    
        });
        
        // Return error if file doesn't exist
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

    } catch (err) {
        res.status(500).send({
            message: `Error: ${err}`,
        });
    }
};