class Term {
  constructor(tag, query) {
    this.type = `term`;
    this.tag = tag;
    this.query = query;
  }

  toString() {
    return `${this.type}=${this.tag}:"${this.query}"`;
  }
}

module.exports = Term;