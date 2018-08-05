const path = require('path');
const readdirp = require('readdirp');
let results = [];

const folderIndexer = (root, callback) => {
  const settings = {
    root,
    entryType: 'all',
    // Filter files with js and json extension
    // fileFilter: ['*.js', '*.json'],
    // Filter by directory
    directoryFilter: ['!.git'],
  };
  readdirp(settings)
    .on('data', function(entry) {
      if (path.extname(entry.name)) {
        results.push(entry);
      }
    })
    .on('error', function(err) {
      callback(err, results);
    })
    .on('end', function() {
      callback(null, results);
      results = [];
    });
};

module.exports = rootDir => {
  return new Promise((resolve, reject) => {
    folderIndexer(rootDir, (err, res) => {
      if (err) reject(err);
      if (res) resolve(res);
    });
  });
};
