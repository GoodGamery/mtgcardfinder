// Negates a predicate
const not = predicate => x => !predicate(x);
module.exports = not;
