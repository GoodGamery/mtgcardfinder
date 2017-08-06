'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('cardfinder', () => {
  it('should return an image resource from GET /card/json?card=Plains', (done) => {
    chai.request(server)
      .get('/card/json?card=Plains')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('imageUrl');
        done();
      });
  });
  it('should return an image resource from GET /card/image?card=Plains', (done) => {
    chai.request(server)
      .get('/card/image?card=Plains')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('should return an image resource from GET /card/image?card=INVALID_NAME', (done) => {
    chai.request(server)
      .get('/card/image?card=INVALID_NAME')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
