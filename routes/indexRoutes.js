const express = require('express');
const router = express.Router();
const indexController = require('./../controller/indexController');

router
  .route('/')
  .get(indexController.getAllIndices)
  .post(indexController.createIndex);

router
  .route('/:index')
  .get(indexController.getIndex)
  .delete(indexController.deleteIndex);

module.exports = router;
