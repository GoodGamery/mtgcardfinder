'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const matchRequireImage = require('../../src/predicates/matchRequireImage');

describe('matchRequireImage', () => {
  it('should match cards with an multiverseId', done => {
    matchRequireImage(null, {multiverseId: 12345}).should.equal(true);
    done();
  });

  it('should reject cards without an multiverseId', done => {
    matchRequireImage(null, {}).should.equal(false);
    done();
  });

  it('should reject cards with a 0 multiverseId', done => {
    matchRequireImage(null, {multiverseId: 0}).should.equal(false);
    done();
  });

});