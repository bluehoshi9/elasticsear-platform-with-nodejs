const express = require('express');
const router = express.Router();
const docController = require('./../controller/documentController');

router.get('/:index?/:id?', docController.getDocument);

module.exports = router;
