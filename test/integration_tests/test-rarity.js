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
  res.body.length.should.be.greaterThan(0);
  res.body[0].should.have.property('name');
  res.body[0].should.have.property('multiverseId');
  res.body[0].should.have.property('imageUrl');
};

describe('rarity search', () => {
  it('should return 0 cards when an invalid rarity is specified', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=rarity:extraterrestrial')
        .end((err, res) => {
          res.type.should.equal(`application/json`);
          res.body.should.be.a('array');
          res.body.length.should.equal(0);
          done();
        });
    });
  });

  it('should return all mythic cards', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=rarity:mythic')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(25);
          res.body.forEach(c => c.rarity.toLowerCase().should.equal(`mythic`));
          done();
        });
    });
  });  
});