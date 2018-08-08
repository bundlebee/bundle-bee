const JS_X = {
  modules: [
    {
      variableName: 'babel',
      packageName: 'rollup-plugin-babel',
    },
  ],
  plugins: [
    `babel({
      babelrc: false,
      presets: [['${require.resolve('babel-preset-es2015-rollup')}'], ['${require.resolve(
      'babel-preset-react'
    )}'], ['${require.resolve('babel-preset-stage-0')}']],
    }),`,
  ],
};
const CSS_SASS_SCSS = {
  modules: [{ variableName: 'scss', packageName: 'rollup-plugin-scss' }],
  plugins: [
    `scss({
       output: './bundle-bee-rollup-dist/bundle.css',
     }),`,
  ],
};
const GIF_PNG_SVG_JPG_JPEG = {
  modules: [{ variableName: 'image', packageName: 'rollup-plugin-image' }],
  plugins: ['image(),'],
};

const HTML = templatePath => ({
  modules: [{ variableName: 'html', packageName: 'rollup-plugin-fill-html' }],
  plugins: [
    `html({
  template: '${templatePath}',
  filename: 'index.html',
}),`,
  ],
});

const base_rules = {
  modules: [
    {
      variableName: 'commonjs',
      packageName: 'rollup-plugin-commonjs',
    },
    {
      variableName: 'resolve',
      packageName: 'rollup-plugin-node-resolve',
    },
    {
      variableName: 'replace',
      packageName: 'rollup-plugin-replace',
    },
  ],
  plugins: [
    `commonjs({
      include: 'node_modules/**',
    }),`,
    `resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      preferBuiltins: false,
    }),`,
    `replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),`,
  ],
};

module.exports = res => {
  const relevantPlugins = [
    ...res.extensions.reduce((acc, ext) => {
      if (ext === '.js' || ext === '.jsx') acc.add('babel');
      if (ext === '.gif' || ext === '.png' || ext === '.svg' || ext === '.jpg' || ext === '.jpeg')
        acc.add('image');
      if (ext === '.scss' || ext === '.sass' || ext === '.css') acc.add('scss');
      if (ext === '.html' && res.indexHtmlPath) acc.add('html');
      return acc;
    }, new Set()),
  ];
  const pluginsInOrder = relevantPlugins
    .reduce(
      (acc, x) => {
        if (x === 'scss') acc[0] = x;
        if (x === 'babel') acc[1] = x;
        if (x === 'image') acc[2] = x;
        if (x === 'html') acc[3] = x;
        return acc;
      },
      [null, null, null, null]
    )
    .filter(x => x);
  res.rollupRules = pluginsInOrder.reduce(
    (acc, name) => {
      if (name === 'babel') {
        acc.modules = acc.modules.concat(JS_X.modules);
        acc.plugins = acc.plugins.concat(JS_X.plugins);
      } else if (name === 'image') {
        acc.modules = acc.modules.concat(GIF_PNG_SVG_JPG_JPEG.modules);
        acc.plugins = acc.plugins.concat(GIF_PNG_SVG_JPG_JPEG.plugins);
      } else if (name === 'scss') {
        acc.modules = acc.modules.concat(CSS_SASS_SCSS.modules);
        acc.plugins = acc.plugins.concat(CSS_SASS_SCSS.plugins);
      } else if (name === 'html') {
        const htmlResult = HTML(res.indexHtmlPath);
        acc.modules = acc.modules.concat(htmlResult.modules);
        acc.plugins = acc.plugins.concat(htmlResult.plugins);
      }
      return acc;
    },
    { modules: base_rules.modules, plugins: base_rules.plugins }
  );
  return res;
};
