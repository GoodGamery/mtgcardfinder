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

describe('search feature', () => {
  it('should return 1 card with detailed search', (done) => {
    chai.request(server)
      .get('/card/json?q=pow:<4 tou:>9 t:Treefolk')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(1);
        res.body.forEach(c => Number(c.power).should.be.equal(2));
        res.body.forEach(c => Number(c.toughness).should.be.equal(10));
        res.body.forEach(c => c.name.should.be.equal(`Indomitable Ancients`));
        done();
      });
  });

  it('should ignore unknown search tags', (done) => {
    chai.request(server)
      .get('/card/json?q=pow:<4 tou:>9 t:Treefolk flooble:flabble')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(1);
        res.body.forEach(c => Number(c.power).should.be.equal(2));
        res.body.forEach(c => Number(c.toughness).should.be.equal(10));
        res.body.forEach(c => c.name.should.be.equal(`Indomitable Ancients`));
        done();
      });
  });

});
