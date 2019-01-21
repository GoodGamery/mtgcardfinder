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
  res.body[0].should.have.property('name');
  res.body[0].should.have.property('multiverseId');
  res.body[0].should.have.property('imageUrl');
};

describe('card text search', () => {
  it('should allow quoted strings', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?limit=10&q=text:"you control:"')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(10);
          done();
        });
    });
  });
});
