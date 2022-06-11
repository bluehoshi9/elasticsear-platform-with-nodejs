const express = require('express');
const router = express.Router();
const indexController = require('./../controller/indexController');

router.get('/:index?/:action?', indexController.getIndex);

module.exports = router;
