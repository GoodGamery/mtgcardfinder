// needle is a string that should exist in the haystack. Return true if it does.
const matchString = (needle, haystack) => {
  if (haystack && needle && needle.length > 0) {
    const firstChar = needle[0];
    const shorterNeedle = needle.slice(1).toLowerCase();
    if (firstChar === `?`) {
      // Relaxed - match any substring
      return haystack.toLowerCase().includes(shorterNeedle);
    } else if (firstChar === `!`) {
      // Strict - match entire string
      return shorterNeedle.toLowerCase() === haystack.toLowerCase();
    } else {
      // Default - match word boundaries
      const reg = new RegExp(`(^|\\W)${needle}(\\W|$)`, `i`);
      return haystack && needle && reg.test(haystack);
    }
  }
  return false;
};

module.exports = matchString;