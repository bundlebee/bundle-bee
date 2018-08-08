const { exec } = require('child_process');

const statsWritePath = process.argv[process.argv.length - 1];
exec(`webpack --profile --json > ${statsWritePath}`, null, error => {
  if (error) process.send({ error });
  else process.send({ status: 'done' });
  process.exit();
});
