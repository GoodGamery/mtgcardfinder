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
  res.body[0].should.have.property('multiverseid');
  res.body[0].should.have.property('imageUrl');
};

describe('cmc search', () => {
  it('should return 5 cards with cmc = 15', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=cmc:=15')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15
          res.body.length.should.equal(5);
          res.body.forEach(c => c.cmc.should.equal(15));
          done();
        });
    });
  });

  it('should return 5 cards with cmc 15', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=cmc:15')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15
          res.body.length.should.equal(5);
          res.body.forEach(c => c.cmc.should.equal(15));
          done();
        });
    });
  });

  it('should return 0 cards with invalid cmc comparison', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=cmc:abc')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`application/json`);
          res.body.should.be.a('array');
          res.body.length.should.equal(0);
          done();
        });
    });
  });

  it('should return 0 cards with invalid cmc operator', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=cmc:===10')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`application/json`);
          res.body.should.be.a('array');
          res.body.length.should.equal(0);
          done();
        });
    });
  });

  it('should return 2 cards with cmc > 15', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=cmc:>15')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 16 or higher
          res.body.length.should.equal(2);
          res.body.forEach(c => c.cmc.should.be.greaterThan(15));
          done();
        });
    });
  });

  it('should return 7 cards cmc >= 15', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=cmc:>=15')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15 or higher
          res.body.length.should.equal(7);
          res.body.forEach(c => c.cmc.should.be.at.least(15));
          done();
        });
    });
  });

  it('should return 10 cards cmc < 1', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=cmc:<1&limit=10')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15 or higher
          res.body.length.should.equal(10);
          res.body.forEach(c => c.cmc.should.be.lessThan(1));
          done();
        });
    });
  });

  it('should return 10 cards cmc <= 0', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=cmc:<=0&limit=10')
        .end((err, res) => {
          validateMtgJson(res);
          // Cards with cost 15 or higher
          res.body.length.should.equal(10);
          res.body.forEach(c => c.cmc.should.be.at.most(1));
          done();
        });
    });
  });
});
