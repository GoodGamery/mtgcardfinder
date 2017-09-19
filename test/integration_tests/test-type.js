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

describe('type search', () => {
  it('should return 12 unicorns', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=t:Unicorn')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(12);
          res.body.forEach(c => c.type.should.contain(`Unicorn`));
          done();
        });
    });
  });

  it('should return 18 legendary goblins', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=t:Goblin t:Legendary')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(18);
          res.body.forEach(c => c.type.should.contain(`Legendary`));
          res.body.forEach(c => c.type.should.contain(`Goblin`));
          done();
        });
    });
  });

  it('should return 9 legendary artifact creatures', (done) => {
    chai.request(server)
      .get('/card/json?unique&q=t:Creature t:Legendary t:Artifact')
      .end((err, res) => {
        validateMtgJson(res);
        res.body.length.should.equal(10);
        res.body.forEach(c => c.type.should.contain(`Legendary`));
        res.body.forEach(c => c.type.should.contain(`Artifact`));
        res.body.forEach(c => c.type.should.contain(`Creature`));
        done();
      });
  });

});
