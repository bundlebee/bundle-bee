const withRegularPath = `{
  entry: require.resolve('src.index.js'),
};`;
const withRegularPathmultiple = `
{
  entry: ['babel-polyfill', require.resolve('src.index.js'), require.resolve('app.index.js')],
};`;
const objectversion = `
    {
      main: require.resolve('src/index.js')
    }`;

const removeRequire = str => str.replace(/require\.resolve|require/g, '');
console.log(removeRequire(objectversion));

let path;
// eval(`path=${objectversion}`);
// console.log(path);
