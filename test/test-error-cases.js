'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const TEST_PORT = 3031 + Math.floor(Math.random() * 10000);
server.listen(TEST_PORT, () => {
  console.log(`Tests running on port ${TEST_PORT}`);
});

// Allows use of `should` in tests
chai.should();
chai.use(chaiHttp);

describe('route error handlers', () => {
  it('should return 200 for missing query string on HTML', (done) => {
    chai.request(server)
      .get('/card/html')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should return 200 for missing query string on IMAGE', (done) => {
    chai.request(server)
      .get('/card/image')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should return 404 for missing query string on JSON', (done) => {
    chai.request(server)
      .get('/card/json')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('should return 404 for missing route', (done) => {
    chai.request(server)
      .get('/card/missingRoute')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
