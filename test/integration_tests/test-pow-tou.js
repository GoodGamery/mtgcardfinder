'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();  // Allows use of `should` in tests
chai.use(chaiHttp);

const app = require('../../app');
const server = app.getExpress();
app.listenRandomPort().then((port) => {
  console.log(`Tests running on port ${port}`);
});

after('done', done => {require('../../server').close(done); done();});

const validateMtgJson = (res) => {
  res.should.have.status(200);
  res.type.should.equal(`application/json`);
  res.body.should.be.a('array');
  res.body.length.should.greaterThan(0);
  res.body[0].should.have.property('name');
  res.body[0].should.have.property('multiverseId');
  res.body[0].should.have.property('imageUrl');
};

describe('pow/tou search', () => {
  it('should return at least 3 cards with low power and high toughness', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=pow:<4 tou:>9')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.be.greaterThan(3);
          res.body.forEach(c => Number(c.power).should.be.lessThan(4));
          res.body.forEach(c => Number(c.toughness).should.be.greaterThan(9));
          done();
        });
    });
  });
});
