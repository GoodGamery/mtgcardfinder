const request = require("request");
const fs = require("fs");
const path = require("path");

const goofs = require("../data/goofs.json");

// stolen from mtg-data, not really needed for scryfall but makes the goofs easier
const normalizeName = (name) => {
  return name
    .split("//")[0] // For split cards, look at only the first portion
    .toLowerCase()  // Always lower case
    .trim();        // No trailing spaces
};

const serveLocal = (res, filename) => {
  if (filename.endsWith(".png"))
    res.contentType("image/png");
  if (filename.endsWith(".jpg"))
    res.contentType("image/jpeg");
  // Patch filename for static image resources
  fs.createReadStream(path.join(__dirname, "..", filename))
    .on("error", (err) => next(err))
    .pipe(res);
};

const getCardImage = (req, res, next) => {
  const cardName = normalizeName(req.query.card || "");
  const goofed = (req.query.goof !== undefined && goofs[cardName] && goofs[cardName]["imageUrl"]);
  console.log(goofed);
  if (goofed) {
    serveLocal(res, goofed);
  } else {
    const url = "https://api.scryfall.com/cards/named";
    const qs = {exact: cardName, format: "image", version: "normal"};
    request.get({url: url, qs: qs})
      .on("error", (err) => serveLocal(res, "/static/images/cardback.jpg"))
      .on("response", (resp) => {
        if (resp.statusCode != 200) {
          serveLocal(res, "/static/images/cardback.jpg");
        } else {
          resp.pipe(res);
        }
      });
  }
};

module.exports = {
    getCardImage: getCardImage
};
