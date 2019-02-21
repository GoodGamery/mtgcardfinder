'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();  // Allows use of `should` in tests
chai.use(chaiHttp);

const app = require('../../app');
const expressServer = app.getExpress();
app.listenRandomPort().then((port) => {
  console.log(`Tests running on port ${port}`);
});

after('done', done => {require('../../server').close(done); done();});

const validateImageResult = (res, resultAccumulator) => {
  res.should.have.status(200);
  res.type.should.equal(`image/jpeg`);
  res.header.should.haveOwnProperty('content-length');
  const imageSize = parseInt(res.header['content-length']);
  imageSize.should.be.greaterThan(0);

  resultAccumulator.push({imageSize: imageSize});
};

function logMemory() {
  const memUsage = process.memoryUsage();
  const oneMeg = 1024 * 1024;
  const formatMem = (bytes) => {
    return `${Math.ceil(bytes / oneMeg)} megabytes`;
  };
  console.info(`      rss : ${formatMem(memUsage.rss)}`);
  console.info(`heapTotal : ${formatMem(memUsage.heapTotal)}`);
  console.info(` heapUsed : ${formatMem(memUsage.heapUsed)}`);
}

describe('memory', () => {
  it('should not use too much memory', (done) => {
    app.getReady().then(async () => {
      const searchUrl = '/image?card=Icy+Manipulator';
      const requester = chai.request(expressServer);

      let testResult;
      const expectedImageSize = 118059;
      const results = [];
      try {
        await requester.get(searchUrl).then(res => validateImageResult(res, results));
        results[0].imageSize.should.equal(expectedImageSize);
      } catch(e) {
        testResult = e;
      }
      requester.close();

      logMemory();

      done(testResult);
    });
  }).timeout(3000);
});