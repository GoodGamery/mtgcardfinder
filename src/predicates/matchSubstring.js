// needle is a space-delimited string of substrings that should exist in
// the haystack. Return true if they ALL do.
const matchSubstring = (needle, haystack) => {
  const lowerHaystack = haystack.toLowerCase();
  const needleArray = needle.toLowerCase().split(` `);
  return !needleArray
    .find(t => !lowerHaystack.includes(t));
};

module.exports = matchSubstring;