// needle is a string that should exist in
// the haystack. Return true if it does.
const matchSubstring = (needle, haystack) => {
  return haystack && needle
    && haystack.toLowerCase()
      .includes(needle.toLowerCase());
};

module.exports = matchSubstring;