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

describe('name search', () => {
  it('should return 18 Mogg cards', (done) => {
    chai.request(server)
      .get('/card/json?q=name:Mogg')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(18);
        res.body.forEach(c => c.name.toLowerCase().should.contain(`mogg`));
        done();
      });
  });

  it('should return 1 Wizard Coastal cards', (done) => {
    chai.request(server)
      .get('/card/json?q=name:Wizard name:Coastal')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(1);
        res.body.forEach(c => c.name.toLowerCase().should.contain(`wizard`));
        res.body.forEach(c => c.name.toLowerCase().should.contain(`coast`));
        done();
      });
  });

});
