'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const matchSubstring = require('../../src/predicates/matchSubstring');

describe('matchSubstring', () => {
  it('should match entire phrases', done => {
    matchSubstring(`a needle`, `haystack: this contains a needle`).should.equal(true);
    matchSubstring(`a needle`, `haystack: this does not contain the needle`).should.equal(false);
    done();
  });

  it('should be case insensitive', done => {
    matchSubstring(`a needle`, `haystack: this contains A NEEDLE`).should.equal(true);
    matchSubstring(`A NEEDLE`, `haystack: this contains a needle`).should.equal(true);
    matchSubstring(`a NeeDLE`, `haystack: this contains A nEEdle`).should.equal(true);
    done();
  });
});