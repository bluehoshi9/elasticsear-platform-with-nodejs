const express = require('express');
const router = express.Router();
const indexController = require('./../controller/indexController');

router.route('/').post(indexController.createIndex);

router.route('/:index').delete(indexController.deleteIndex);

module.exports = router;
