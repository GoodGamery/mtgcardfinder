// Matches cards with images
const matchRequireImage = (searchProp, card) => {
  return !!card.imageUrl;
};

module.exports = matchRequireImage;
