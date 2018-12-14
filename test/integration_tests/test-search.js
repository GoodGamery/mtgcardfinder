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

const validateImageResult = (res, resultAccumulator) => {
  res.should.have.status(200);
  res.type.should.equal(`image/jpeg`);
  res.header.should.haveOwnProperty('content-length');
  const imageSize = parseInt(res.header['content-length']);
  imageSize.should.be.greaterThan(0);

  resultAccumulator.push({imageSize: imageSize});
};

after('done', done => {require('../../server').close(done); done();});

describe('search', () => {
  it('should return 1 card with detailed search', (done) => {
    app.getReady().then(() => {
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
  });

  it('should ignore unknown search tags', (done) => {
    app.getReady().then(() => {
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

  it('should find Fact or Fiction', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=name:"Fact+or+Fiction"')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(1);
          res.body[0].name.should.equal(`Fact or Fiction`);
          done();
        });
    });
  });

  it('should allow logical OR', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=name:"Fact+or+Fiction" or name:"Blinkmoth+Infusion"')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(2);
          res.body[0].name.should.equal(`Fact or Fiction`);
          res.body[1].name.should.equal(`Blinkmoth Infusion`);
          done();
        });
    });
  });

  it('should allow logical NOT', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=cmc:<2 not cmc:=0 not cmc:=0.5')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(25);
          res.body.forEach(c => c.cmc.should.equal(1));
          done();
        });
    });
  });

  it('should allow logical AND', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=pow:6 and tou:2 and t:golem')
        .end((err, res) => {
          validateMtgJson(res);
          res.body.length.should.equal(1);
          res.body[0].name.should.equal(`Glass Golem`);
          done();
        });
    });
  });

  it('should throw exception for misplaced AND', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=and pow:6')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  it('should throw exception for misplaced OR', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=or pow:6')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  it('should throw exception for misplaced NOT', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=not')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });


  it('should throw exception for mismatched parens', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=t:instant)')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  it('should throw exception for mismatched parens', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=(t:instant')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  it('should allow parentheses to control order of operations', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=t:goblin and (t:instant or t:sorcery)')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.length.should.equal(4);
          done();
        });
    });
  });

  it('should allow searching for multiple cards of the same name', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?q=name:"Kami of the Crescent Moon"')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.length.should.be.greaterThan(1);
          done();
        });
    });
  });

  it('should allow using the "unique" query param to filter out duplicates', (done) => {
    app.getReady().then(() => {
      chai.request(server)
        .get('/card/json?unique&q=name:"Kami of the Crescent Moon"')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.length.should.equal(1);
          done();
        });
    });
  });

  it('should return the same image when a search is repeated', (done) => {
    app.getReady().then(async () => {
      const searchUrl = '/image?card=Mountain';      
      const requester = chai.request(server).keepOpen();

      let testResult;
      const results = []; 
      try {
        for (var i = 0; i < 2; i++) {
          await requester.get(searchUrl).then(res => validateImageResult(res, results));  
        }
        const uniqueImages = results.map(images => images.imageSize).filter((value, index, ary) => ary.indexOf(value) === index);
        uniqueImages.should.have.lengthOf(1);
      } catch(e) {
        testResult = e;    
      }
      requester.close();
      done(testResult);
    });
  }).timeout(3000);; 

  it('should return images with different file sizes for random image search', (done) => {
    app.getReady().then(async () => {
      const searchUrl = '/image?card=Mountain&sort=random';      
      const requester = chai.request(server).keepOpen();

      let testResult;
      const results = []; 
      try {
        for (var i = 0; i < 3; i++) {
          await requester.get(searchUrl).then(res => validateImageResult(res, results));  
        }
        const uniqueImages = results.map(images => images.imageSize).filter((value, index, ary) => ary.indexOf(value) === index);
        uniqueImages.should.have.lengthOf.at.least(2);
      } catch(e) {
        testResult = e;    
      }
      requester.close();
      done(testResult);
    });
  }).timeout(3000);

  it('should return correct image for version-specific image search', (done) => {
    app.getReady().then(async () => {
      const searchUrl = '/image?card=Icy%20Manipulator&version=ice';      
      const requester = chai.request(server);
 
      let testResult;
      const expectedImageSize = 35402;     
      const results = []; 
      try {
        await requester.get(searchUrl).then(res => validateImageResult(res, results));         
        results[0].imageSize.should.equal(expectedImageSize);
      } catch(e) {
        testResult = e;    
      }
      requester.close();
      done(testResult);
    });
  }).timeout(3000);

  it('should return images with different file sizes for "any version" image search', (done) => {
    app.getReady().then(async () => {
      const searchUrl = '/image?card=Mountain&version=any';      
      const requester = chai.request(server).keepOpen();
      let testResult;
      const results = []; 
      try {
        for (var i = 0; i < 3; i++) {
          await requester.get(searchUrl).then(res => validateImageResult(res, results));  
        }
        const uniqueImages = results.map(images => images.imageSize).filter((value, index, ary) => ary.indexOf(value) === index);
        uniqueImages.should.have.lengthOf.at.least(2);
      } catch(e) {
        testResult = e;    
      }
      requester.close();
      done(testResult);
    });
  }).timeout(3000);
});