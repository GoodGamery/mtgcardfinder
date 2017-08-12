'use strict';

const compose = (...args) => {
  if (args.length === 1)
    return args[0];
  if (args.length === 2)
    return composeTwo(args[0], args[1]);
  return compose(args[0], args.slice(1));
};

const composeTwo = (f, g) => {
  return x => f(g(x));
};

module.exports = compose;
