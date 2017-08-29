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

describe('card set search', () => {
  it('should search for cards in a set', (done) => {
    chai.request(server)
      .get('/card/json?limit=25&q=set:"Hour of Devastation" t:"Legendary Creature"')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(7);  // There are 5 legendary creatures in Hour of Devastation
        done();
      });
  });
});