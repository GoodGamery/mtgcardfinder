'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const matchString = require('../../src/predicates/matchString');

describe('matchSubstring', () => {
  it('should match entire phrases when relaxed', done => {
    matchString(`?a needle`, `haystack: this contains a needle`).should.equal(true);
    matchString(`?needle`,   `haystack: this contains needles`).should.equal(true);
    matchString(`?a needle`, `haystack: this does not contain the needle`).should.equal(false);
    done();
  });

  it('should be case insensitive when relaxed', done => {
    matchString(`?a needle`, `haystack: this contains A NEEDLE`).should.equal(true);
    matchString(`?A NEEDLE`, `haystack: this contains a needle`).should.equal(true);
    matchString(`?a NeeDLE`, `haystack: this contains A nEEdle`).should.equal(true);
    done();
  });

  it('should match entire phrases when relaxed', done => {
    matchString(`?a needle`, `haystack: this contains a needle`).should.equal(true);
    matchString(`?a needle`, `haystack: this does not contain the needle`).should.equal(false);
    done();
  });

  it('should be case insensitive', done => {
    matchString(`a needle`, `haystack: this contains A NEEDLE`).should.equal(true);
    matchString(`A NEEDLE`, `haystack: this contains a needle`).should.equal(true);
    matchString(`a NeeDLE`, `haystack: this contains A nEEdle`).should.equal(true);
    done();
  });

  it('should not match sub-words', done => {
    matchString(`ant`, `tribal instant - tyrant`).should.equal(false);
    matchString(`bear`, `unbearable puns`).should.equal(false);
    done();
  });

  it('should match entire strings', done => {
    matchString(`!ant`, `ant`).should.equal(true);
    matchString(`!ant`, `ANT`).should.equal(true);
    matchString(`!ANT`, `ant`).should.equal(true);
    done();
  });

  it('should not match entire strings if different', done => {
    matchString(`!ant`, `ant ant`).should.equal(false);
    matchString(`!topsy`, `topsy turvey`).should.equal(false);
    matchString(`!good`, `not good`).should.equal(false);
    done();
  });
});