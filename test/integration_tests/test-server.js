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

describe('cardfinder', () => {
  it('should return JSON from GET (plains) /card/json', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?card=Plains')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(1);
          res.body[0].name.should.equal(`Plains`);
          done();
        });
    });
  });

  it('should return card name from GET (plains) /card/name', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/name?card=Plains')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`text/plain`);
          res.text.should.equal(`Plains`);
          done();
        });
    });
  });

  it('should return card name from GET (plains) /card/html', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/html?card=Plains')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`text/html`);
          done();
        });
    });
  });

  it('should return exactly 11 cards from GET (q=t:Basic) /card/json', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=t:Basic')
        .end((err, res) => {
          validateMtgJson(res);
          // Basics, snow-covered basics, Wastes
          res.body.length.should.equal(11);
          done();
        });
    });
  });

  it('should return JSON from GET (smallpox) /card/json', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?card=Smallpox')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(1);
          res.body[0].name.should.equal(`Smallpox`);
          res.body[0].multiverseId.should.equal(417484);
          done();
        });
    });
  });

  it('should return JSON from GET (smallpox, goof mode) /card/json', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?goof&card=Smallpox')
        .end((err, res) => {
          validateMtgJson(res);
          // Response headers
          res.body.length.should.equal(1);
          res.body[0].name.should.equal(`Smallpox`);
          res.body[0].multiverseId.should.equal(417484);
          res.body[0].imageUrl.should.equal('/static/goofs/smallpox.png');
          done();
        });
    });
  });

  it('should return 404 from GET (invalid cardname) /card/json', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?card=INVALID_NAME')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  it('should return an image resource from GET /card/image', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/image?card=Plains')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`image/jpeg`);
          res.body.length.should.above(10000);
          done();
        });
    });
  });

  it('should return a static image resource from GET /card/image with an invalid card name', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/image?card=INVALID_NAME')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`image/jpeg`);
          res.body.length.should.above(10000);
          done();
        });
    });
  });

  it('should return a random image when asking for sort=random', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/image?sort=random&q=t:"legendary creature"')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`image/jpeg`);
          res.body.length.should.above(10000);
          done();
        });
    });
  });

  it('should return random cards from sort=random', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?sort=random&q=t:"legendary creature"')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(25);
          done();
        });
    });
  });

  it('should return 404 when asking for card names for a search with zero results', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/name?q=pow:<5 pow:>5')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  it('should return an image/png for smallpox goof', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/image?card=Smallpox&goof')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`image/png`);
          res.body.length.should.above(10000);
          done();
        });
    });
  });

  it('should return an image/jpeg for blurred mongoose goof', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/image?card=blurred mongoose&goof')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal(`image/jpeg`);
          res.body.length.should.above(10000);
          done();
        });
    });
  });
});
