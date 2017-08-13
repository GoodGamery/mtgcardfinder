// Combines multiple predicates into one, via logical and
const and = (...args) =>
  (x) => {
    for(let i = 0; i < args.length; ++i) {
      if (!args[i](x))
        return false;
    }
    return true;
  };


module.exports = and;
