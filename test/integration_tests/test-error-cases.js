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

describe('route error handlers', () => {
  it('should return 200 for missing query string on HTML', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/html')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  }).timeout(15000);

  it('should return 200 for missing query string on IMAGE', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/image')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  it('should return 404 for missing query string on JSON', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  it('should return 404 for missing route', (done) => {
    app.getReady().then(() => {
    chai.request(server)
      .get('/card/missingRoute')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });
});