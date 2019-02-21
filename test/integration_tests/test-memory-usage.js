process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();  // Allows use of `should` in tests
chai.use(chaiHttp);
const helpers = require('../test-helpers');

const app = require('../../app');
const expressServer = app.getExpress();
app.listenRandomPort().then((port) => {
  console.log(`Tests running on port ${port}`);
});

after('done', done => {require('../../server').close(done); done();});

describe('memory', () => {
  it('should not use too much memory', (done) => {
    app.getReady().then(async () => {
      const searchUrl = '/image?card=Icy+Manipulator';
      const requester = chai.request(expressServer);

      let testResult;
      const expectedImageSize = 118059;
      const results = [];
      try {
        await requester.get(searchUrl).then(res => helpers.validateImageResult(res, results));
        results[0].imageSize.should.equal(expectedImageSize);
      } catch(e) {
        testResult = e;
      }
      requester.close();

      helpers.logMemory();

      done(testResult);
    });
  }).timeout(10000);
});