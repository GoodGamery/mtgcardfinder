'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const matchNumber = require('../../src/predicates/matchNumber');

describe('matchNumber', () => {
  it('should match equals', done => {
    matchNumber(`=5`, 5).should.equal(true);
    matchNumber(`5`, 5).should.equal(true);
    matchNumber(`5`, 4.999).should.equal(false);
    done();
  });

  it('should match inequality', done => {
    matchNumber(`<>5`, 5).should.equal(false);
    matchNumber(`<>5`, 4).should.equal(true);
    matchNumber(`<>5`, undefined).should.equal(false);
    done();
  });

  it('should not match non-numbers in operation', done => {
    matchNumber(`=five`, 5).should.equal(false);
    matchNumber(`=`, 0).should.equal(false);
    done();
  });


  it('should not match fake operators', done => {
    matchNumber(`=<5`, 5).should.equal(false);
    matchNumber(`=>5`, 5).should.equal(false);
    matchNumber(`=====5`, 5).should.equal(false);
    matchNumber(`<<6`, 5).should.equal(false);
    matchNumber(`>>7`, 5).should.equal(false);
    done();
  });

  it('should not match non-numbers', done => {
    matchNumber(`5`, `5`).should.equal(false);
    matchNumber(`0`, undefined).should.equal(false);
    matchNumber(`0`, null).should.equal(false);
    done();
  });

  it('should match greater than', done => {
    matchNumber(`>5`, 6).should.equal(true);
    matchNumber(`>5`, 5).should.equal(false);
    matchNumber(`>5`, 4).should.equal(false);
    matchNumber(`>5`, undefined).should.equal(false);
    done();
  });

  it('should match greater than or equal', done => {
    matchNumber(`>=5`, 6).should.equal(true);
    matchNumber(`>=5`, 5).should.equal(true);
    matchNumber(`>=5`, 4).should.equal(false);
    matchNumber(`>=5`, undefined).should.equal(false);
    done();
  });

  it('should match less than', done => {
    matchNumber(`<5`, 6).should.equal(false);
    matchNumber(`<5`, 5).should.equal(false);
    matchNumber(`<5`, 4).should.equal(true);
    matchNumber(`<5`, undefined).should.equal(false);
    done();
  });

  it('should match less than or equal', done => {
    matchNumber(`<=5`, 6).should.equal(false);
    matchNumber(`<=5`, 5).should.equal(true);
    matchNumber(`<=5`, 4).should.equal(true);
    matchNumber(`<=5`, undefined).should.equal(false);
    done();
  });
});