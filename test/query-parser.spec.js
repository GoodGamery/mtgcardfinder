'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const qParser = require('../src/query-parser');

describe('query parser', () => {
  it('should parse single queries', done => {
    const results = qParser("tag:query");
    results.length.should.equal(1);
    results[0].type.should.equal(`term`);
    results[0].tag.should.equal(`tag`);
    results[0].query.should.equal(`query`);
    done();
  });

  it('should parse multiple queries', done => {
    const results = qParser("a:b c:d e:f");
    results.length.should.equal(3);
    results[0].type.should.equal(`term`);
    results[0].tag.should.equal(`a`);
    results[0].query.should.equal(`b`);
    results[1].type.should.equal(`term`);
    results[1].tag.should.equal(`c`);
    results[1].query.should.equal(`d`);
    results[2].type.should.equal(`term`);
    results[2].tag.should.equal(`e`);
    results[2].query.should.equal(`f`);
    done();
  });

  it('should parse quoted strings, but remove the quotes', done => {
    const results = qParser(`tag:"quoted query"`);
    results.length.should.equal(1);
    results[0].tag.should.equal(`tag`);
    results[0].query.should.equal(`quoted query`);
    done();
  });

  it('should allow non-word characters', done => {
    const results = qParser(`pow:<4 tou:>9`);
    results.length.should.equal(2);
    results[0].tag.should.equal(`pow`);
    results[0].query.should.equal(`<4`);
    results[1].tag.should.equal(`tou`);
    results[1].query.should.equal(`>9`);
    done();
  });

  it('should parse multiple quoted strings', done => {
    const results = qParser(`tag1:"quoted query" tag2:"another great one"`);
    results.length.should.equal(2);
    results[0].tag.should.equal(`tag1`);
    results[0].query.should.equal(`quoted query`);
    results[1].tag.should.equal(`tag2`);
    results[1].query.should.equal(`another great one`);
    done();
  });

  it('should allow colons inside of quoted strings', done => {
    const results = qParser(`tag:"ahoy: there"`);
    results.length.should.equal(1);
    results[0].tag.should.equal(`tag`);
    results[0].query.should.equal(`ahoy: there`);
    done();
  });

  it('should allow colons inside of multiple quoted strings', done => {
    const results = qParser(`a:"magic: the gathering" b:nothing c:"come on, what's the deal?"`);
    results.length.should.equal(3);
    results[0].tag.should.equal(`a`);
    results[0].query.should.equal(`magic: the gathering`);
    results[1].tag.should.equal(`b`);
    results[1].query.should.equal(`nothing`);
    results[2].tag.should.equal(`c`);
    results[2].query.should.equal(`come on, what's the deal?`);
    done();
  });

  it('should allow space after colon', done => {
    const results = qParser(`a: b`);
    results.length.should.equal(1);
    results[0].tag.should.equal(`a`);
    results[0].query.should.equal(`b`);
    done();
  });

  it('should return zero results for incomplete tag:query', done => {
    const results = qParser(`tag`);
    results.length.should.equal(0);
    done();
  });

  it('should return zero results for invalid double quotes', done => {
    const results = qParser(`tag::query`);
    results.length.should.equal(0);
    done();
  });

  it('should return zero results for quote before colon', done => {
    const results = qParser(`tag":query`);
    results.length.should.equal(0);
    done();
  });

  it('should return zero results for unclosed quotes', done => {
    const results = qParser(`tag:"query`);
    results.length.should.equal(0);
    done();
  });

  it('should return zero results for invalid double tags', done => {
    const results = qParser(`a b:query`);
    results.length.should.equal(0);
    done();
  });

  it('should return zero results for quote before tag', done => {
    const results = qParser(`"a:b`);
    results.length.should.equal(0);
    done();
  });

  it('should return zero results for colon before tag', done => {
    const results = qParser(`:a:b`);
    results.length.should.equal(0);
    done();
  });

  it ('should parse "or" between terms using postfix', done => {
    const results = qParser(`a:b or c:d`);
    results.length.should.equal(3);
    results[0].tag.should.equal(`a`);
    results[0].query.should.equal(`b`);
    results[1].tag.should.equal(`c`);
    results[1].query.should.equal(`d`);
    results[2].type.should.equal(`operator`);
    results[2].operator.should.equal(`or`);
    done();
  });

  it ('should treat "or" after colon as a query', done => {
    const results = qParser(`a:or`);
    results.length.should.equal(1);
    results[0].tag.should.equal(`a`);
    results[0].query.should.equal(`or`);
    done();
  });

  it ('should treat colon after "or" as an error', done => {
    const results = qParser(`or:b`);
    results.length.should.equal(1);
    results[0].type.should.equal(`operator`);
    results[0].operator.should.equal(`or`);
    done();
  });

  it ('should treat "or" in quoted queries as text', done => {
    const results = qParser(`name:"Fact or Fiction"`);
    results.length.should.equal(1);
    results[0].type.should.equal(`term`);
    results[0].tag.should.equal(`name`);
    results[0].query.should.equal(`Fact or Fiction`);
    done();
  });
});