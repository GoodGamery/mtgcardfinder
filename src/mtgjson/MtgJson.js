// API for https://mtgjson.com
const request = require('request-promise-native');

const baseUrl = `https://mtgjson.com/json`;

class MtgJson {
  static getVersion() {
    return request.get(`${baseUrl}/version.json`)
      .then(body => JSON.parse(body));
  }

  static getAllSets() {
    return request.get(`${baseUrl}/AllSets.json`)
      .then(body => JSON.parse(body));
  }

}

module.exports = MtgJson;