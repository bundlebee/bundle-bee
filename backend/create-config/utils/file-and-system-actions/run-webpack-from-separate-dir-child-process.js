const fs = require('fs');
const spawn = require('child_process').spawn;

const statsWritePath = process.argv[process.argv.length - 1];
const resultsStream = fs.createWriteStream(statsWritePath);

const child = spawn('webpack', ['--profile', '--json']);

child.stdout.pipe(resultsStream);

child.on('close', function(code) {
  console.log('child process exited with code ' + code);
  process.send('done');
  process.exit();
});

child.on('error', error => {
  process.send({ error });
  process.exit();
});
