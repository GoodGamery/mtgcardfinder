'use strict';

const express = require('express');
const router = express.Router();
const CardApi = require('../src/card-api');

// ?card=Plains
router.get('/json', CardApi.getCardJson);

// ?card=Plains
router.get('/html', CardApi.getCardHtml);

// ?card=Plains
router.get('/image', CardApi.getCardImage);

module.exports = router;
