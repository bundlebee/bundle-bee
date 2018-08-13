const fs = require('fs');
const path = require('path');
const upath = require('upath');

const sizeTimingPluginPath = upath.normalize(
  path.join(__dirname, 'custom_plugin', 'size_timing.js')
);

module.exports = res =>
  new Promise((resolve, reject) => {
    let { plugins, modules } = res.rollupRules;

    modules = modules.reduce(
      (acc, rule) =>
        acc +
        `const ${rule.variableName} = require('${upath.normalize(
          require.resolve(rule.packageName)
        )}');` +
        '\n',
      ''
    );
    plugins = plugins.reduce((acc, plugin) => acc + `${plugin}` + '\n', '');
    const localRollupConfigSavePath = upath.normalize(
      path.join(__dirname, '..', '..', '..', '..', 'electronUserData', 'rollup.config.js')
    );
    const usersRollupConfigSavePath = upath.normalize(
      path.join(res.rootDir, 'bundle-bee-rollup.config.js')
    );
    const configString = `
    ${modules}
    const sizeTimingPlugin = require('${sizeTimingPluginPath}');

    module.exports = {
      input: '${upath.normalize(res.entry)}',
      output: {
        file: './bundle-bee-rollup-dist/bundle.js',
        format: 'iife',
      },
      plugins: [${plugins} sizeTimingPlugin()]
    };
    `;
    res.rollupDependencies = JSON.stringify({
      devDependencies: res.rollupDependencies,
    });
    res.rollupConfigString = configString;
    fs.writeFile(localRollupConfigSavePath, configString, err => {
      if (err) reject(err);
      fs.writeFile(usersRollupConfigSavePath, configString, err => {
        if (err) reject(err);
        resolve(res);
      });
    });
  });
