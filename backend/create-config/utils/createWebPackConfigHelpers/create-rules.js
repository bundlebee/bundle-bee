const MiniCssExtractPluginDotLoaderString = 'MiniCssExtractPlugin.loader';

const JS_X = {
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
};
const GIF_PNG_SVG_JPG_JPEG = {
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
};
const CSS_SASS_SCSS = {
  test: /\.(sa|sc|c)ss$/,
  use: [MiniCssExtractPluginDotLoaderString, 'css-loader', 'sass-loader'],
};
const LESS = {
  test: /\.less$/,
  use: [
    'style-loader' /* // creates style nodes from JS strings */,
    'css-loader' /* // translates CSS into CommonJS */,
    'less-loader' /*  // compiles Less to CSS */,
  ],
};

module.exports = extensions => {
  // create rules array of appropriate loaders
  const dependencies = [];
  const alreadyAdded = new Set();
  const rules = extensions.reduce((acc, ext) => {
    if ((ext === '.js' || ext === '.jsx') && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.js');
      alreadyAdded.add('.jsx');
      acc.push(JS_X);
    } else if (
      (ext === '.gif' || ext === '.png' || ext === '.svg' || ext === '.jpg' || ext === '.jpeg') &&
      !alreadyAdded.has(ext)
    ) {
      alreadyAdded.add('.gif');
      alreadyAdded.add('.png');
      alreadyAdded.add('.jpg');
      alreadyAdded.add('.jpeg');
      alreadyAdded.add('.svg');
      acc.push(GIF_PNG_SVG_JPG_JPEG);
    } else if ((ext === '.css' || ext === '.scss' || ext === '.sass') && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.scss');
      alreadyAdded.add('.sass');
      alreadyAdded.add('.css');
      acc.push(CSS_SASS_SCSS);
    } else if (ext === '.less' && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.less');
      acc.push(LESS);
    }
    return acc;
  }, []);
  return { rules, dependencies };
};
