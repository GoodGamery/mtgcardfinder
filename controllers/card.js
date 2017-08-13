'use strict';

const express = require('express');
const router = express.Router();
const CardApi = require('../src/card-api');

// ?card=Plains
// ?q=t:Basic
router.get('/', CardApi.getCardJsonList);
router.get('/json', CardApi.getCardJsonList);
router.get('/name', CardApi.getCardNameList);
router.get('/html', CardApi.getCardHtml);
router.get('/image', CardApi.getCardImage);

module.exports = router;
