const Vehicle = require("../models/vehicle.model.js");
const fs = require('fs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const sharp = require("sharp");
const uploadFile = require("../middlewares/upload");

// Retrieve all vehicle from the database (with condition).
exports.findAll = (req, res) => {
    const name = req.query.name;
  
    Vehicle.findAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving vehicles."
        });
      else res.send(data);
    });
};

// Create and Save a new vehicle
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Create a new vehicle
  const vehicle = new Vehicle({
    name: req.body.name
  });

  // Save vehicle in the database
  Vehicle.create(vehicle, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Vehicle."
      });
    else res.send(data);
  });
};

// Find a single vehicle by Id
exports.findOne = (req, res) => {
  Vehicle.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found vehicle with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving vehicle with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a vehicle identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  console.log(req.body);

  // Update a vehicle
  const vehicle = new Vehicle({
    name: req.body.name
  });

  Vehicle.updateById(
    req.params.id,
    new Vehicle(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found vehicle with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating vehicle with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Upload vehicle image
exports.imageUpload = async (req, res) => {
  try {
    // Get vehicle ID from URL params 
    const vehicleId = req.params.id;

    // Define path
    const path = __basedir + "/resources/assets/uploads/";
    
    // Upload file with multer
    await uploadFile(req, res);
    
    // Return error if file doesn't exist
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

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
      let imageFullpath = vehicleId+"_"+newName+"_"+size+"."+ext
      
      // Create a new resized image
      sharp(path+vehicleId+"_"+filename)
        .resize({
          height: size
        })
        .toFile(path+imageFullpath)

      // Data to be stored into database
      let vehicleImage = {
        vehicle_id: vehicleId,
        path: imageFullpath,
        size: size
      };

      // Save vehicle in the database
      Vehicle.upload(vehicleImage, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Vehicle."
          });
        else res.send(data);
      });
    });

    res.status(200).send({
      message: "Uploaded the file successfully: " + filename,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 2MB!",
        });
    }
    
    res.status(500).send({
      message: `Could not upload the file: ${err}`,
    });
  }
}