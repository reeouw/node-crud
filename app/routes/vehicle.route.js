module.exports = app => {
  
    const vehicles = require('../controllers/vehicle.controller.js');

    const { check } = require('express-validator');
    
    var router = require('express').Router();
  
    // Retrieve all vehicles
    router.get('/', vehicles.findAll);
  
    // Create a new vehicle
    router.post('/', [
      check('name').notEmpty().withMessage('Name is required'),
    ],
    vehicles.create);
  
    // Retrieve a single vehicle with id
    router.get('/:id', vehicles.findOne);

    // Upload vehicle images
    router.post('/:id/image', vehicles.imageUpload);
  
    // Update a vehicle with id
    router.put('/:id',[
      check('name').notEmpty().withMessage('Name is required'),
    ], 
    vehicles.update);
  
    app.use('/api/vehicles', router);
  };
  