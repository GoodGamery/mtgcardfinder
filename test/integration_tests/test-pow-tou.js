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
  res.body.length.should.greaterThan(0);
  res.body[0].should.have.property('name');
  res.body[0].should.have.property('multiverseid');
  res.body[0].should.have.property('imageUrl');
};

describe('pow/tou search', () => {
  it('should return 3 cards with low power and high toughness', (done) => {
    chai.request(server)
      .get('/card/json?q=pow:<4 tou:>9')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(3);
        res.body.forEach(c => Number(c.power).should.be.lessThan(4));
        res.body.forEach(c => Number(c.toughness).should.be.greaterThan(9));
        done();
      });
  });
});
