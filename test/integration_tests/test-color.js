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

const validateMtgJson = (res) => {
  res.should.have.status(200);
  res.type.should.equal(`application/json`);
  res.body.should.be.a('array');
  res.body[0].should.have.property('name');
  res.body[0].should.have.property('multiverseid');
  res.body[0].should.have.property('imageUrl');
};

describe('color search', () => {
  it('should return 12 cards with exact mana red, white, blue', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=color:!rwum')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(12);
          done();
        });
    });
  });
});
