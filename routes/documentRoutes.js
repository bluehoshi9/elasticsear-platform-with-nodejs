const express = require('express');
const router = express.Router();
const docController = require('./../controller/documentController');

router.route('/').post(docController.createDocument);

router.route('/:index/:id').delete(docController.deleteDocument);

module.exports = router;
