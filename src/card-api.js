const request = require('request');
const fs = require('fs');
const path = require('path');

const getCardImage = (req, res, next) => {
  const card = global.mtgData.getSingleCardFromQuery(req.query);
  if (!card || !card.multiverseId) {
    fs.createReadStream(path.join(__dirname, `..`, `static`, `images`, `cardback.jpg`))
      .on(`error`, (err) => next(err))
      .pipe(res).type('image/jpeg');
  } else {
    const url = card.imageUrl || `${global.mtgData.imagePrefix}${card.multiverseId}`;
    if (url.startsWith(`/static/`)) {
      if (url.endsWith(`.png`))
        res.contentType(`image/png`);
      if (url.endsWith(`.jpg`))
        res.contentType(`image/jpeg`);
      // Patch url for static image resources
      fs.createReadStream(path.join(__dirname, `..`, url))
        .on(`error`, (err) => next(err))
        .pipe(res);
    } else {
      if (card.isRandomOrVersioned)
        res.set(`Cache-Control`, `no-cache, no-store`);
      request.get(url).pipe(res);
    }
  }
};

const getCardHtml = (req, res) => {
  const limit = coerceNumber(req.query.limit, 25, 1, 50);
  const cards = global.mtgData.getCardsFromQuery(req.query, limit);
  if (cards && cards.length > 0) {
    const htmlResults = cards
      .map(card => card && card.multiverseId
      ? `<img src="${card.imageUrl ? card.imageUrl : global.mtgData.imagePrefix + card.multiverseId}" />`
      : `<img src="/static/images/cardback.jpg" />`
    );
    res.send(`<!DOCTYPE html>
      <html>
        <body>
          ${htmlResults.join(``)}
        </body>
      </html>
    `);
  } else {
    res.send(`<img src="/static/images/cardback.jpg" />`);
  }
};

const getCardJsonList = (req, res) => {
  const limit = coerceNumber(req.query.limit, 25, 1, 50);
  const cards = global.mtgData.getCardsFromQuery(req.query, limit);
  if (!cards)
    return res.status(404).send(`No cards found for request card=${req.query.card} q=${req.query.q}`);
  res.send(cards);
};

const getCardNameList = (req, res) => {
  const limit = coerceNumber(req.query.limit, 25, 1, 50);
  const cards = global.mtgData.getCardsFromQuery(req.query, limit);
  if (!cards || cards.length === 0)
    return res.status(404).send(`No cards found for request card=${req.query.card} q=${req.query.q}`);
  res.contentType(`text/plain`).send(cards.map(card => card.name).join(`\n`));
};

const coerceNumber = (sourceValue, defaultValue, min, max) => {
  let num = Number(sourceValue);
  if (isNaN(num))
    return defaultValue;
  return Math.min(Math.max(num, min), max);
};

module.exports = {
  getCardImage: getCardImage,
  getCardHtml: getCardHtml,
  getCardJsonList: getCardJsonList,
  getCardNameList: getCardNameList
};
