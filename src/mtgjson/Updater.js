// Updates remote versioned files in the downloads directory
const path = require('path');
const fs = require('fs-extra');
const MtgJson = require('./MtgJson');

const DOWNLOAD_DIR = path.join(__dirname, `../../downloads`);
const VERSION_FILENAME = `version.json`;
const DATA_FILENAME = `AllSets.json`;

class Updater {
  static async updateAllSets() {
    console.log(`Updating MTG card data...`);
    let versionFile = `0.0.0`;
    let dataFile = {};
    let forceUpdate = false;

    try {
      versionFile = await fs.readJson(path.join(DOWNLOAD_DIR, VERSION_FILENAME));
    }  catch (err) {
      console.error(`MTG Data version file couldn't be loaded, forcing update from mtgjson.com.`);
      forceUpdate = true;
    }

    try {
      dataFile = await fs.readJson(path.join(DOWNLOAD_DIR, DATA_FILENAME));
    }  catch (err) {
      console.error(`MTG Data file couldn't be loaded, forcing update from mtgjson.com.`);
      forceUpdate = true;
    }

    console.log(`MTG data version: ${versionFile}`);
    const mtgJsonVersion = await MtgJson.getVersion();

    if (forceUpdate || Updater.compareVersion(versionFile, mtgJsonVersion) > 0) {
      // Need to update file
      console.log(`Updating data file: ${versionFile} ->  ${mtgJsonVersion}`);
      dataFile = await MtgJson.getAllSets();
      await fs.writeJson(path.join(DOWNLOAD_DIR, DATA_FILENAME), dataFile);
      await fs.writeJson(path.join(DOWNLOAD_DIR, VERSION_FILENAME), mtgJsonVersion);
      console.log("MTG data has been updated.");
    } else {
      console.log("MTG data is up to date.");
    }

    // The most recent data...
    return dataFile;
  }

  // Return <0 if a is greater, >0 if b is greater
  static compareVersion(a, b) {
    if (a === null || a === undefined)
      return -1;
    if (b === null || b === undefined)
      return 1;
    let aParts = a.split(`.`).map(n => Number(n));
    let bParts = b.split(`.`).map(n => Number(n));
    for (let i = 0; i < a.length; ++i) {
      const comparePart = Updater.compareNumber(aParts[i], bParts[i]);
      if (comparePart !== 0)
        return comparePart;
    }

    const compareLength = Updater.compareNumber(aParts.length, bParts.length);
    if (compareLength !== 0)
      return compareLength;

    if (aParts.length > bParts.length)
      return -1;
    else if (aParts.length < bParts.length)
      return 1;
  }

  // Return <0 if a is greater, >0 if b is greater
  static compareNumber(a, b) {
    if (a === null || a === undefined || isNaN(a))
      return -1;
    if (b === null || b === undefined || isNaN(b))
      return 1;
    return b - a;
  }
}

module.exports = Updater;