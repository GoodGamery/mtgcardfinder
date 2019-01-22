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

describe('layout search', () => {

  it('should return normal cards', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=layout:normal+name:"flametongue kavu"')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15
          res.body.length.should.equal(1);
          res.body.forEach(c => c.type.should.equal(`Creature — Kavu`));
          done();
        });
    });
  });

  it('should return vanguard cards', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=layout:vanguard+name:"flametongue kavu"')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15
          res.body.length.should.equal(1);
          res.body.forEach(c => c.type.should.equal(`Vanguard`));
          done();
        });
    });
  });

  it('should return actual cards', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=actualCards:true+name:"!grind"')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15
          res.body.length.should.equal(1);
          res.body.forEach(c => c.type.should.equal(`Sorcery`));
          res.body.forEach(c => c.layout.should.equal(`split`));
          done();
        });
    });
  });

  it('should return aftermath cards by default (note that they are split)', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=name:"!grind"')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15
          res.body.length.should.equal(1);
          res.body.forEach(c => c.type.should.equal(`Sorcery`));
          res.body.forEach(c => c.layout.should.equal(`split`));
          done();
        });
    });
  });

  it('should return normal cards by default', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=name:"flametongue"')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15
          res.body.length.should.equal(1);
          res.body.forEach(c => c.type.should.equal(`Creature — Kavu`));
          res.body.forEach(c => c.layout.should.equal(`normal`));
          done();
        });
    });
  });


});
