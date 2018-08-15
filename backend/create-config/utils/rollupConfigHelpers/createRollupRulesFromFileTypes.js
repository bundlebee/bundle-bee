const upath = require('upath');

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
      exclude: 'node_modules/**',
      presets: [['${upath.normalize(
        require.resolve('babel-preset-es2015-rollup')
      )}'], ['${upath.normalize(require.resolve('babel-preset-react'))}'], ['${upath.normalize(
      require.resolve('babel-preset-stage-0')
    )}']],
    }),`,
  ],
  dependencies: {
    'babel-preset-es2015-rollup': '^3.0.0',
    'rollup-plugin-babel': '^3.0.7',
  },
};
const CSS_SASS_SCSS = {
  modules: [{ variableName: 'scss', packageName: 'rollup-plugin-scss' }],
  plugins: [
    `scss({
       output: './bundle-bee-rollup-dist/bundle.css',
     }),`,
  ],
  dependencies: {
    'rollup-plugin-sass': '^0.9.2',
    'rollup-plugin-scss': '^0.4.0',
  },
};
const GIF_PNG_SVG_JPG_JPEG = {
  modules: [{ variableName: 'image', packageName: 'rollup-plugin-image' }],
  plugins: ['image(),'],
  dependencies: {
    'rollup-plugin-image': '^1.0.2',
  },
};

const HTML = templatePath => ({
  modules: [{ variableName: 'html', packageName: 'rollup-plugin-fill-html' }],
  plugins: [
    `html({
  template: '${upath.normalize(templatePath)}',
  filename: 'index.html',
}),`,
  ],
  dependencies: {
    'rollup-plugin-fill-html': '^1.1.0',
  },
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
    {
      variableName: 'json',
      packageName: 'rollup-plugin-json',
    },
    {
      variableName: 'uglify',
      packageName: 'rollup-plugin-uglify'
    }
  ],
  plugins: [
    `commonjs({
      include: 'node_modules/**',
            namedExports: {
        'node_modules/react-dom/index.js': ['render', 'findDOMNode'],
        'node_modules/react/index.js': ['Component', 'Children', 'createElement', 'cloneElement'],
      },
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
    `json(),`,
  ],
  dependencies: {
    webpack: '^4.16.2',
    'webpack-cli': '^3.1.0',
    path: '^0.12.7',
    'rollup-plugin-commonjs': '^9.1.4',
    'rollup-plugin-json': '^3.0.0',
    'rollup-plugin-node-resolve': '^3.3.0',
    'rollup-plugin-replace': '^2.0.0',
    rollup: '^0.64.1',
    "rollup-plugin-uglify": "^4.0.0"
  },
};

module.exports = res => {
  res.rollupDependencies = base_rules.dependencies;
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
        res.rollupDependencies = Object.assign(JS_X.dependencies, res.rollupDependencies);
      } else if (name === 'image') {
        acc.modules = acc.modules.concat(GIF_PNG_SVG_JPG_JPEG.modules);
        acc.plugins = acc.plugins.concat(GIF_PNG_SVG_JPG_JPEG.plugins);
        res.rollupDependencies = Object.assign(
          GIF_PNG_SVG_JPG_JPEG.dependencies,
          res.rollupDependencies
        );
      } else if (name === 'scss') {
        acc.modules = acc.modules.concat(CSS_SASS_SCSS.modules);
        acc.plugins = acc.plugins.concat(CSS_SASS_SCSS.plugins);
        res.rollupDependencies = Object.assign(CSS_SASS_SCSS.dependencies, res.rollupDependencies);
      } else if (name === 'html') {
        const htmlResult = HTML(res.indexHtmlPath);
        acc.modules = acc.modules.concat(htmlResult.modules);
        acc.plugins = acc.plugins.concat(htmlResult.plugins);
        res.rollupDependencies = Object.assign(htmlResult.dependencies, res.rollupDependencies);
      }
      return acc;
    },
    { modules: base_rules.modules, plugins: base_rules.plugins }
  );
  return res;
};
