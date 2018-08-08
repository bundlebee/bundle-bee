const fs = require('fs');

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

    const configString = `
    ${modules}

    export default {
      input: '/Users/bren/React/1-indecisionApp-rollup-tests/src/index.js',
      output: {
        file: './bundle-bee-rollup-dist/bundle.js',
        format: 'iife',
      },
      plugins: [${plugins}]
    };
    `;
    fs.writeFile(
      '/Users/bren/Codesmith/bundle-bee/mvp/electronUserData/rollup.config.js',
      configString,
      err => {
        if (err) reject(err);
        fs.writeFile(
          '/Users/bren/React/1-indecisionApp-rollup-tests/bundle-bee-rollup.config.js',
          configString,
          err => {
            if (err) reject(err);
            resolve(res);
          }
        );
      }
    );
  });
