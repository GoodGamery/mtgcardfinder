'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const matchSubstringWord = require('../../src/predicates/matchSubstringWord');

describe('matchSubstringWord', () => {
  it('should match entire phrases', done => {
    matchSubstringWord(`a needle`, `haystack: this contains a needle`).should.equal(true);
    matchSubstringWord(`a needle`, `haystack: this does not contain the needle`).should.equal(false);
    done();
  });

  it('should be case insensitive', done => {
    matchSubstringWord(`a needle`, `haystack: this contains A NEEDLE`).should.equal(true);
    matchSubstringWord(`A NEEDLE`, `haystack: this contains a needle`).should.equal(true);
    matchSubstringWord(`a NeeDLE`, `haystack: this contains A nEEdle`).should.equal(true);
    done();
  });

  it('should not match sub-words', done => {
    matchSubstringWord(`ant`, `tribal instant - tyrant`).should.equal(false);
    matchSubstringWord(`bear`, `unbearable puns`).should.equal(false);
    done();
  });
});