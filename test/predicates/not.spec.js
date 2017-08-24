'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const not = require('../../src/predicates/not');

const t = () => true;
const f = () => false;

describe('not', () => {
  it('should create a predicate that negates the provided one', done => {
    not(t)().should.equal(false);
    not(f)().should.equal(true);
    done();
  });
});