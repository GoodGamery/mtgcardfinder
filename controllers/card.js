'use strict';

const express = require('express');
const router = express.Router();
const CardApi = require('../src/card-api');

// ?card=Plains

router.get('/', CardApi.getCardJsonList);
router.get('/json', CardApi.getCardJson);
router.get('/json/list', CardApi.getCardJsonList);
router.get('/name', CardApi.getCardNameList);
router.get('/name/list', CardApi.getCardNameList);
router.get('/html', CardApi.getCardHtml);
router.get('/image', CardApi.getCardImage);

module.exports = router;
