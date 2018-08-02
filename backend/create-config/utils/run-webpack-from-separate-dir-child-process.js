const cmd = require('node-cmd');

const fs = require('fs');
const exec = require('child_process').exec;

const statsWritePath = process.argv[process.argv.length - 1];
var child;
child = exec(`webpack --profile --json`, { maxBuffer: 1024 * 100000 }, function(
  error,
  stdout,
  stderr
) {
  if (error) {
    process.send({ error });
  } else {
    fs.writeFile(statsWritePath, stdout, (error, res) => {
      if (error) {
        process.send({ error });
      } else {
        process.send({ webpack: 'complete' });
      }
    });
  }
});
