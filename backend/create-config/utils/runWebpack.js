const path = require('path');
const { exec } = require('child_process');

const statsWritePath = process.argv[process.argv.length - 1];

const webpackCommandAbsoluteLocation = path.join(
  require.resolve('webpack'),
  '..',
  '..',
  'bin',
  'webpack.js'
);
console.log('cwd: ', process.cwd());
console.log('webpack command: ');
console.log(`${webpackCommandAbsoluteLocation} --profile --json > ${statsWritePath}`);
exec(`${webpackCommandAbsoluteLocation} --profile --json > ${statsWritePath}`, null, error => {
  if (error) process.send({ error });
  else process.send({ status: 'done' });
  process.exit();
});
