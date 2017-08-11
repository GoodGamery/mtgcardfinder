'use strict';

const express = require('express');
const router = express.Router();
const cardRoute = require('./card');

router.use('/card', cardRoute);
router.use('/', cardRoute);

module.exports = router;