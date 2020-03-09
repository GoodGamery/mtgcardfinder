// Updates remote versioned files in the downloads directory
const path = require('path');
const fs = require('fs-extra');
const MtgJson = require('./MtgJson');

const DOWNLOAD_DIR = path.join(__dirname, `../../downloads`);
const VERSION_FILENAME = `version.json`;
const DATA_FILENAME = `AllSets.json`;

class Updater {
  // Returns a readStream with the data
  static async updateAllSets() {
    console.log(`Updating MTG card data...`);
    let versionFile = `0.0.0`;
    let needsUpdate = false;

    try {
      versionFile = await fs.readJson(path.join(DOWNLOAD_DIR, VERSION_FILENAME));
    }  catch (err) {
      console.error(`MTG Data version file couldn't be loaded, forcing update from mtgjson.com.`);
      needsUpdate = true;
    }

    console.log(`MTG Data version: ${versionFile}`);
    let mtgJsonVersion = "0.0.0";
    try {
      let mtgJsonResponse = await MtgJson.getVersion();
      mtgJsonVersion = mtgJsonResponse.version;
    } catch (err) {
      console.error(`Couldn't update version file:`, err);
    }

    if (Updater.compareVersion(versionFile, mtgJsonVersion) > 0) {
      console.log(`MTG Data needs to be updated`);
      needsUpdate = true;
    }

    // Load data from local file
    if (!needsUpdate) {
      try {
        console.log(`MTG Data is up to date. Loading from file.`);
        return fs.createReadStream(path.join(DOWNLOAD_DIR, DATA_FILENAME));
      } catch (err) {
        console.error(`MTG Data file couldn't be loaded, forcing update from mtgjson.com.`);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      try {
        // Need to update file
        console.log(`Updating MTG Data file: ${versionFile} ->  ${mtgJsonVersion}`);

        // Pipe MTGJson data to the file
        let allSetsStream = MtgJson.getAllSetsStream();
        let writeStream = fs.createWriteStream(path.join(DOWNLOAD_DIR, DATA_FILENAME));
        allSetsStream.pipe(writeStream);

        // Update stored version number
        await fs.writeJson(path.join(DOWNLOAD_DIR, VERSION_FILENAME), mtgJsonVersion);

        console.log(`MTG Data has been updated to ${mtgJsonVersion}.`);

        return allSetsStream;
      } catch (err) {
        console.error(`Couldn't update the data file:`, err);
      }
    }
  }
  
  // Return <0 if a is greater, >0 if b is greater
  static compareVersion(a, b) {
    console.log(`Version Check - We have this one: ${a}, MtgJson.com has: ${b}`);
    if (a === null || a === undefined)
      return -1;
    if (b === null || b === undefined)
      return 1;

    // Pull out the last updated date
    let aVersion = a.split(`+`);
    let bVersion = b.split(`+`);
    let aDate = Number(aVersion[1]);
    let bDate = Number(bVersion[1]);

    // Compare the dates
    if (aDate !== undefined && bDate !== undefined) {
      return Updater.compareNumber(aDate, bDate);
    }

    // Compare version dots
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