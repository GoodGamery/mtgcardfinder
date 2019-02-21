// Test the JSON streams
process.env.NODE_ENV = 'test';
const JSONStream = require('JSONStream');
const path = require('path');
const fs = require('fs');
const helpers = require('./test-helpers');

const DOWNLOAD_DIR = path.join(__dirname, `../downloads`);
const DATA_FILENAME = `AllSets.json`;

const chai = require('chai');
chai.should(); // Allows use of `should` in tests

describe('jsonStream', () => {
  it('should stream in the JSON data and store it', (done) => {
    let cards = [];
    fs.createReadStream(path.join(DOWNLOAD_DIR, DATA_FILENAME))
      .pipe(JSONStream.parse([true, `cards`, true]))
      .on('data', (card) => {
        cards.push(card);
      })
      .on('end', () => {
        console.log(`>>> Loaded ${cards.length} cards`);
        helpers.logMemory();
        done();
      });
  }).timeout(15000);
});
