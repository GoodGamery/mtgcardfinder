// Combines multiple predicates into one, via logical OR
const or = (...args) =>
  (x) => {
    for(let i = 0; i < args.length; ++i) {
      if (args[i](x))
        return true;
    }
    return false;
  };

module.exports = or;
