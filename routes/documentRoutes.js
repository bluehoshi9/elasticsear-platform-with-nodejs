const express = require('express');
const router = express.Router();
const docController = require('./../controller/documentController');

router.route('/').post(docController.createDocument);

router.route('/:index').get(docController.getAllDocuments);

router
  .route('/:index/:id')
  .get(docController.getDocument)
  .patch(docController.updateDocument)
  .delete(docController.deleteDocument);

module.exports = router;
