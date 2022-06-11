const express = require('express');
const router = express.Router();
const indexInfoController = require('./../controller/indexInfoController');

router.get('/:index?/', indexInfoController.getIndexInfo);

module.exports = router;
