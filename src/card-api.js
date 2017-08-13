'use strict';

const request = require('request');
const fs = require('fs');
const path = require('path');
const MtgData = require('./mtg-data');

const getCardImage = (req, res, next) => {
  const card = MtgData.getCardFromQuery(req.query);
  if (!card || !card.multiverseid) {
    fs.createReadStream(path.join(__dirname, `..`, `static`, `images`, `cardback.jpg`))
      .on(`error`, (err) => next(err))
      .pipe(res).type('image/jpeg');
  } else {
    const url = card.imageUrl;
    if (url.startsWith(`/static/`)) {
      // Patch url for static image resources
      fs.createReadStream(path.join(__dirname, `..`, url))
        .on(`error`, (err) => next(err))
        .pipe(res);
    } else {
      request.get(url).pipe(res);
    }
  }
};

const getCardHtml = (req, res) => {
  const card = MtgData.getCardFromQuery(req.query);
  if (card && card.imageUrl)
    res.send(`<img src="${card.imageUrl}" />`);
  else
    res.send(`<img src="/static/images/cardback.jpg" />`);
};

const getCardJson = (req, res) => {
  const card = MtgData.getCardFromQuery(req.query);
  if (!card)
    return res.status(404).send(`No card found for request card=${req.query.card} q=${req.query.q}`);
  res.send(card);
};

module.exports = {
  getCardImage: getCardImage,
  getCardHtml: getCardHtml,
  getCardJson: getCardJson
};
