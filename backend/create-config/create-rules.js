const JS_X = {
  test: /\.jsx?$/i,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['babel-preset-env', 'babel-preset-react'],
      plugins: ['transform-class-properties'],
    },
  },
};
const CSS = { test: /\.css$/i, use: 'css-loader' };
const GIF_PNG_SVG_JPG_JPEG = {
  test: /\.(gif|png|jpe?g|svg)$/i,
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

const SASS_SCSS = {
  test: /\.s(c|a)ss$/i,
  exclude: /node_modules/,
  use: ['style-loader', 'css-loader', 'sass-loader'],
};
const LESS = {
  test: /\.less$/i,
  use: [
    'style-loader' /* // creates style nodes from JS strings */,
    'css-loader' /* // translates CSS into CommonJS */,
    'less-loader' /*  // compiles Less to CSS */,
  ],
};

module.exports = extensions => {
  // create rules array of appropriate loaders
  const alreadyAdded = new Set();
  return extensions.reduce((acc, ext) => {
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
    } else if (ext === '.css' && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.css');
      acc.push(CSS);
    } else if ((ext === '.scss' || ext === '.sass') && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.scss');
      alreadyAdded.add('.sass');
      acc.push(SASS_SCSS);
    } else if (ext === '.less' && !alreadyAdded.has(ext)) {
      alreadyAdded.add('.less');
      acc.push(LESS);
    }
    return acc;
  }, []);
};
