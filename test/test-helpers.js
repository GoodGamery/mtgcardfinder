// Helper methods for testing

function logMemory() {
  const memUsage = process.memoryUsage();
  const oneMeg = 1024 * 1024;
  const formatMem = (bytes) => {
    return `${Math.ceil(bytes / oneMeg)} MiB`;
  };
  console.info(`        rss : ${formatMem(memUsage.rss)}`);
  console.info(`  heapTotal : ${formatMem(memUsage.heapTotal)}`);
  console.info(`   heapUsed : ${formatMem(memUsage.heapUsed)}`);
}

const validateMtgJson = (res) => {
  res.should.have.status(200);
  res.type.should.equal(`application/json`);
  res.body.should.be.a('array');
  res.body.length.should.be.greaterThan(0);
  res.body[0].should.have.property('name');
  res.body[0].should.have.property('multiverseId');
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

module.exports = {logMemory, validateMtgJson, validateImageResult};