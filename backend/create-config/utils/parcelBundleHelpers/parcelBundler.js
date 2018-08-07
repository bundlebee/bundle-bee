const path = require('path');
const Bundler = require('parcel-bundler');

const parcelEntryFile = process.argv[2];

// define the bundler
const bundler = new Bundler(parcelEntryFile, options);
bundler.bundle();

// on bundler completion, gather size and timing information
bundler.on('bundled', mainBundle => {
  console.log(mainBundle);
});
