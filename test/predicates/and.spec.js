'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const and = require('../../src/predicates/and');

const t = () => true;
const f = () => false;

describe('and', () => {
  it('should create a predicate that returns true if all provided predicates are true', done => {
    and(t, t)().should.equal(true);
    and(t, f)().should.equal(false);
    and(f, t)().should.equal(false);
    and(f, f)().should.equal(false);
    done();
  });
});