module.exports = app => {
    const mobilku = require('../controllers/mobilku.controller.js');    
    var router = require('express').Router();

    // Create a new user
    router.post('/', mobilku.create);
    
    // Show user
    router.get('/:id', mobilku.show);

    app.use('/api/mobilku', router);
  };
  