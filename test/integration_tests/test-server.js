'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

const TEST_PORT = 3031 + Math.floor(Math.random() * 10000);
server.listen(TEST_PORT, () => {
  console.log(`Tests running on port ${TEST_PORT}`);
});

// Allows use of `should` in tests
chai.should();

chai.use(chaiHttp);

const validateMtgJson = (res) => {
  res.should.have.status(200);
  res.type.should.equal(`application/json`);
  res.body.should.be.a('array');
  res.body[0].should.have.property('name');
  res.body[0].should.have.property('multiverseid');
  res.body[0].should.have.property('imageUrl');
};

describe('cardfinder', () => {
  it('should return JSON from GET (plains) /card/json', (done) => {
    chai.request(server)
      .get('/card/json?card=Plains')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(1);
        res.body[0].name.should.equal(`Plains`);
        res.body[0].multiverseid.should.equal(430880);
        res.body[0].imageUrl.should.equal('http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=430880');
        done();
      });
  });

  it('should return card name from GET (plains) /card/name', (done) => {
    chai.request(server)
      .get('/card/name?card=Plains')
      .end((err, res) => {
        res.should.have.status(200);
        res.type.should.equal(`text/plain`);
        res.text.should.equal(`Plains`);
        done();
      });
  });

  it('should return card name from GET (plains) /card/html', (done) => {
    chai.request(server)
      .get('/card/html?card=Plains')
      .end((err, res) => {
        res.should.have.status(200);
        res.type.should.equal(`text/html`);
        res.text.should.contain(`http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=430880`);
        done();
      });
  });

  it('should return exactly 11 cards from GET (q=t:Basic) /card/json', (done) => {
    chai.request(server)
      .get('/card/json?q=t:Basic')
      .end((err, res) => {
        validateMtgJson(res);
        // Basics, snow-covered basics, Wastes
        res.body.length.should.equal(11);
        done();
      });
  });

  it('should return JSON from GET (smallpox) /card/json', (done) => {
    chai.request(server)
      .get('/card/json?card=Smallpox')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(1);
        res.body[0].name.should.equal(`Smallpox`);
        res.body[0].multiverseid.should.equal(417484);
        res.body[0].imageUrl.should.equal('http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=417484');
        done();
      });
  });

  it('should return JSON from GET (smallpox, goof mode) /card/json', (done) => {
    chai.request(server)
      .get('/card/json?goof&card=Smallpox')
      .end((err, res) => {
        validateMtgJson(res);
        // Response headers
        res.body.length.should.equal(1);
        res.body[0].name.should.equal(`Smallpox`);
        res.body[0].multiverseid.should.equal(417484);
        res.body[0].imageUrl.should.equal('/static/goofs/smallpox.png');
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

  it('should return a static image resource from GET /card/image with an invalid card name', (done) => {
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
