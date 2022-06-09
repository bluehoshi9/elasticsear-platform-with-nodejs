const express = require('express');
const router = express.Router();
const searchController = require('./../controller/searchController');

router.get('/:index?/', searchController.doSearch);

module.exports = router;
