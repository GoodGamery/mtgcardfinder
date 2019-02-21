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
};

describe('name search', () => {
  it('should return 18 Mogg cards', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=name:Mogg')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(18);
          res.body.forEach(c => c.name.toLowerCase().should.contain(`mogg`));
          done();
        });
    });
  });

  it('should return 1 Wizard Coastal cards', (done) => {
    app.getReady().then(() => {
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

});
