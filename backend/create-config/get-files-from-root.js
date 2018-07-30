const path = require('path');
const readdirp = require('readdirp');
const results = [];

module.exports = (root, callback) => {
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
      return callback(null, results);
    });
};
