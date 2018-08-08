const fs = require('fs');
const { exec } = require('child_process');

const statsWritePath = process.argv[process.argv.length - 1];
// const resultsStream = fs.createWriteStream(statsWritePath);

exec(`webpack --profile --json > ${statsWritePath}`, null, error => {
  if (error) process.send({ error });
  else process.send({ status: 'done' });
  process.exit();
});

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

// child.stdout.pipe(resultsStream);

// child.on('close', function(code) {
//   setTimeout(() => {
//     console.log('child process exited with code ' + code);
//     process.send('done');
//     process.exit();
//   }, 5000);
// });

// child.on('error', error => {
//   process.send({ error });
//   process.exit();
// });
