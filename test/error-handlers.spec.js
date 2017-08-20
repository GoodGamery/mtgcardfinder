'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');

const errorHandlers = require('../src/error-handlers');


// Allows use of `should` in tests
chai.should();

const mockError = {
  stack: `Mock stack`,
  message: `This is a mock error`,
  toString: () => `${this.message}`
};

const mockReq = {};
const mockRes = {};

const getMockRes = (done, headersSent) => {
  let res = {};
  res.headersSent = headersSent || false;
  res.send = (obj) => {
    obj.error.should.equal('Unhandled server error.');
    done();
  };
  res.json = (obj) => {
    obj.error.should.equal(mockError);
    done();
  };
  res.status = (code) => {
    code.should.equal(500);
    return res;
  };
  return res;
};

describe('error handling middleware', () => {
  it('should log errors and invoke next', (done) => {
    errorHandlers.logErrors(mockError, mockReq, mockRes, () => (done()));
  });


  it('should send 500 errors when xhr is true', (done) => {
    errorHandlers.clientErrorHandler(
      mockError,
      {xhr: true},
      getMockRes(done),
      () => chai.fail()
    );
  });

  it('should invoke next when xhr is false', (done) => {
    errorHandlers.clientErrorHandler(
      mockError,
      {xhr: false},
      getMockRes(done),
      () => done()
    );
  });

  it('should send 500 if headers not sent', (done) => {
    errorHandlers.errorHandler(
      mockError,
      mockRes,
      getMockRes(done),
      () => chai.fail()
    );
  });

  it('should invoke next if headers already sent', (done) => {
    errorHandlers.errorHandler(
      mockError,
      mockRes,
      getMockRes(() => chai.fail(), true),
      () => done()
    );
  });

});
