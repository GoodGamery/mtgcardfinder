'use strict';
process.env.NODE_ENV = 'test';
const chai = require('chai');
chai.should(); // Allows use of `should` in tests

const shuffle = require('../src/shuffle');

describe('shuffle', () => {
  it('should change array in-place', (done) => {
    let original = [];
    for(let i = 0; i < 999; ++i)
      original.push(i);
    let originalLength = original.length;
    // Keep shuffling
    while(original[0] === 0)
      shuffle(original);
    original.length.should.equal(originalLength);
    original[0].should.be.greaterThan(0);
    done();
  });
});
