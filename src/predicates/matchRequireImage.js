// Matches cards with images
const matchRequireImage = (searchProp, card) => {
  return !!card.multiverseId;
};

module.exports = matchRequireImage;
