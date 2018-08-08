const fs = require('fs');
const path = require('path');

module.exports = res =>
  new Promise((resolve, reject) => {
    let { plugins, modules } = res.rollupRules;

    modules = modules.reduce(
      (acc, rule) =>
        acc +
        `const ${rule.variableName} = require('${require.resolve(rule.packageName)}');` +
        '\n',
      ''
    );
    plugins = plugins.reduce((acc, plugin) => acc + `${plugin}` + '\n', '');
    const localRollupConfigSavePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'electronUserData',
      'rollup.config.js'
    );
    const usersRollupConfigSavePath = path.join(res.rootDir, 'bundle-bee-rollup.config.js');
    const configString = `
    ${modules}

    export default {
      input: '${res.entry}',
      output: {
        file: './bundle-bee-rollup-dist/bundle.js',
        format: 'iife',
      },
      plugins: [${plugins}]
    };
    `;
    res.rollupConfigString = configString;
    fs.writeFile(localRollupConfigSavePath, configString, err => {
      if (err) reject(err);
      fs.writeFile(usersRollupConfigSavePath, configString, err => {
        if (err) reject(err);
        resolve(res);
      });
    });
  });
