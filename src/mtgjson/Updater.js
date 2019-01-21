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

    console.log(`MTG Data version: ${versionFile}`);
    let mtgJsonVersion = "0.0.0";
    try {
      mtgJsonVersion = await MtgJson.getVersion();
    } catch (err) {
      console.error(`Couldn't update version file:`, err);
    }

    if (forceUpdate || Updater.compareVersion(versionFile, mtgJsonVersion) > 0) {
      try {
        // Need to update file
        console.log(`Updating MTG Data file: ${versionFile} ->  ${mtgJsonVersion}`);
        dataFile = await MtgJson.getAllSets();
        await fs.writeJson(path.join(DOWNLOAD_DIR, DATA_FILENAME), dataFile);
        await fs.writeJson(path.join(DOWNLOAD_DIR, VERSION_FILENAME), mtgJsonVersion);
        console.log(`MTG Data has been updated.`);
      } catch (err) {
        console.error(`Couldn't update the data file:`, err);
      }
    } else {
      console.log(`MTG Data is up to date.`);
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

    // Check for new versioning structure
    if (b.version !== undefined)
      b = b.version;

    console.log(`Versions - a: ${a}, b: ${b}`);

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