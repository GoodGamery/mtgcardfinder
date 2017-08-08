'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

const validateMtgJson = (res) => {
  res.should.have.status(200);
  res.type.should.equal(`application/json`);
  res.body.should.be.a('object');
  res.body.should.have.property('name');
  res.body.should.have.property('multiverseid');
  res.body.should.have.property('imageUrl');
}

describe('cardfinder', () => {
  it('should return JSON from GET (plains) /card/json', (done) => {
    chai.request(server)
      .get('/card/json?card=Plains')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.name.should.equal(`Plains`);
        res.body.multiverseid.should.equal(129683);
        res.body.imageUrl.should.equal('http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=129683');
        done();
      });
  });

  it('should return JSON from GET (smallpox) /card/json', (done) => {
    chai.request(server)
      .get('/card/json?card=Smallpox')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.name.should.equal(`Smallpox`);
        res.body.multiverseid.should.equal(237010);
        res.body.imageUrl.should.equal('http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=237010');
        done();
      });
  });

  it('should return JSON from GET (smallpox, goof mode) /card/json', (done) => {
    chai.request(server)
      .get('/card/json?goof&card=Smallpox')
      .end((err, res) => {
        validateMtgJson(res);
        // Response headers
        res.body.name.should.equal(`Smallpox`);
        res.body.multiverseid.should.equal(237010);
        res.body.imageUrl.should.equal('/static/goofs/smallpox.png');
        done();
      });
  });

  it('should return 404 from GET (invalid cardname) /card/json', (done) => {
    chai.request(server)
      .get('/card/json?card=INVALID_NAME')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('should return an image resource from GET /card/image', (done) => {
    chai.request(server)
      .get('/card/image?card=Plains')
      .end((err, res) => {
        res.should.have.status(200);
        res.type.should.equal(`image/jpeg`);
        res.body.length.should.above(10000);
        done();
      });
  });

  it('should return an image resource from GET /card/image with an invalid card name', (done) => {
    chai.request(server)
      .get('/card/image?card=INVALID_NAME')
      .end((err, res) => {
        res.should.have.status(200);
        res.type.should.equal(`image/jpeg`);
        res.body.length.should.above(10000);
        done();
      });
  });
});
