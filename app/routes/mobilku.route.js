module.exports = app => {
    const mobilku = require('../controllers/mobilku.controller.js');    
    var router = require('express').Router();

    // Create a new user
    router.post('/', mobilku.create);

    app.use('/api/mobilku', router);
  };
  