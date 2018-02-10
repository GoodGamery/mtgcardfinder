'use strict';

const express = require('express');
const router = express.Router();
const CardApi = require('../src/card-api');
const Scryfall = require('../src/scryfall');

// ?card=Plains
// ?q=t:Basic
router.get('/', CardApi.getCardJsonList);
router.get('/json', CardApi.getCardJsonList);
router.get('/name', CardApi.getCardNameList);
router.get('/html', CardApi.getCardHtml);
router.get('/image', CardApi.getCardImage);
router.get('/imagesf', Scryfall.getCardImage);

module.exports = router;
