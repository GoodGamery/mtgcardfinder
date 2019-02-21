// API for https://mtgjson.com
const requestPromise = require('request-promise-native');
const request = require('request');

const baseUrl = `https://mtgjson.com/json`;

class MtgJson {
  static getVersion() {
    return requestPromise.get(`${baseUrl}/version.json`)
      .then(body => JSON.parse(body));
  }

  static getAllSets() {
    return requestPromise.get(`${baseUrl}/AllSets.json`)
      .then(body => JSON.parse(body));
  }

  static getAllSetsStream() {
    return request.get(`${baseUrl}/AllSets.json`);
  }
}

module.exports = MtgJson;