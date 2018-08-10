const JS_X = {
  rules: `
{
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['babel-preset-env', 'babel-preset-react', 'babel-preset-stage-0'].map(x =>
        require.resolve(x)
      ),
    },
  },
}`,
  dependencies: {
    babel: '^6.23.0',
    'babel-core': '^6.26.3',
    'babel-loader': '^7.1.5',
    'babel-preset-env': '^1.7.0',
    'babel-preset-react': '^6.24.1',
    'babel-preset-stage-0': '^6.24.1',
  },
};
const GIF_PNG_SVG_JPG_JPEG = {
  rules: `{
  test: /\.(gif|png|jpe?g|svg)$/,
  use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        bypassOnDebug: true, // webpack@1.x
        disable: true, // webpack@2.x and newer
      },
    },
  ],
}`,
  dependencies: { 'file-loader': '^1.1.11' },
};
const CSS_SASS_SCSS = {
  rules: `
{
  test: /\.(sa|sc|c)ss$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
}`,
  dependencies: {
    'node-sass': '^4.9.2',
    'sass-loader': '^7.0.3',
    'style-loader': '^0.21.0',
    'css-loader': '^0.28.10',
  },
};
const LESS = {
  rules: `
{
  test: /\.less$/,
  use: [
    'style-loader' /* // creates style nodes from JS strings */,
    'css-loader' /* // translates CSS into CommonJS */,
    'less-loader' /*  // compiles Less to CSS */,
  ],
}`,
  dependencies: {
    'node-sass': '^4.9.2',
    'sass-loader': '^7.0.3',
    'style-loader': '^0.21.0',
    'css-loader': '^0.28.10',
  },
};

module.exports = extensions => {
  let dependencies = {
    webpack: '^4.16.2',
    'html-webpack-plugin': '^3.2.0',
    'mini-css-extract-plugin': '^0.4.1',
    path: '^0.12.7',
  };
  const alreadyAdded = new Set();
  const rules = extensions.reduce((acc, ext) => {
    if ((ext === '.js' || ext === '.jsx') && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.js');
      alreadyAdded.add('.jsx');
      acc.push(JS_X.rules);
      dependencies = Object.assign(JS_X.dependencies, dependencies);
    } else if (
      (ext === '.gif' || ext === '.png' || ext === '.svg' || ext === '.jpg' || ext === '.jpeg') &&
      !alreadyAdded.has(ext)
    ) {
      alreadyAdded.add('.gif');
      alreadyAdded.add('.png');
      alreadyAdded.add('.jpg');
      alreadyAdded.add('.jpeg');
      alreadyAdded.add('.svg');
      acc.push(GIF_PNG_SVG_JPG_JPEG.rules);
      dependencies = Object.assign(GIF_PNG_SVG_JPG_JPEG.dependencies, dependencies);
    } else if ((ext === '.css' || ext === '.scss' || ext === '.sass') && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.scss');
      alreadyAdded.add('.sass');
      alreadyAdded.add('.css');
      acc.push(CSS_SASS_SCSS.rules);
      dependencies = Object.assign(CSS_SASS_SCSS.dependencies, dependencies);
    } else if (ext === '.less' && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.less');
      acc.push(LESS.rules);
      dependencies = Object.assign(LESS.dependencies, dependencies);
    }
    return acc;
  }, []);
  return { rules, dependencies };
};
