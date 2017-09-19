'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const matchRequireImage = require('../../src/predicates/matchRequireImage');

describe('matchRequireImage', () => {
  it('should match cards with an imageUrl', done => {
    matchRequireImage(null, {imageUrl: `test`}).should.equal(true);
    done();
  });

  it('should reject cards without an imageUrl', done => {
    matchRequireImage(null, {}).should.equal(false);
    done();
  });

  it('should reject cards with a blank imageUrl', done => {
    matchRequireImage(null, {imageUrl: ``}).should.equal(false);
    done();
  });

});