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

describe('set name search', () => {
  it('Should return 25 cards from "Mirrodin"', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=set:!mirrodin&limit=25')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(25);
          res.body.forEach(c => c.set.toLowerCase().should.equal(`mirrodin`));
          done();
        });
    });
  });

  it('Should return 25 cards from sets with name containing "Mirrodin"', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=set:mirrodin&sort=random&limit=25')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(25);
          res.body.forEach(c => c.set.toLowerCase().should.include(`mirrodin`));
          done();
        });
    });
  });
});