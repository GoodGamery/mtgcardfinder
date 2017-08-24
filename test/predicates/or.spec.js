'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const or = require('../../src/predicates/or');

const t = () => true;
const f = () => false;

describe('or', () => {
  it('should create a predicate that returns true if any of the provided predicates are true', done => {
    or(t, t)().should.equal(true);
    or(t, f)().should.equal(true);
    or(f, t)().should.equal(true);
    or(f, f)().should.equal(false);
    done();
  });
});