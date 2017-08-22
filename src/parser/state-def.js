class StateDef {
  constructor(value, name) {
    this.value = value;
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

module.exports = StateDef;