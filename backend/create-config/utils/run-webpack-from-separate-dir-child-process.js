const fs = require('fs');
const spawn = require('child_process').spawn;

// const statsWritePath = process.argv[process.argv.length - 1];
const resultsStream = fs.createWriteStream('/Users/bren/Desktop/stats.json');

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

//?? was initially set as an exec function, but those require a buffer, which is less performant, and you have to set a max (so it could error/run out hypothetically)
// const fs = require('fs');
// const exec = require('child_process').exec;

// const statsWritePath = process.argv[process.argv.length - 1];

// exec(`webpack --profile --json`, { maxBuffer: 1024 * 100000 }, (error, stdout) => {
//   if (error) {
//     process.send({ error });
//   } else {
//     fs.writeFile('/Users/bren/Desktop/stats.json', stdout, (error, res) => {
//       if (error) {
//         process.send({ error });
//       } else {
//         process.send({ webpack: 'complete' });
//       }
//     });
//   }
// });
