const babylon = require('babylon');
const traverse = require('babel-traverse').default;

module.exports = (res, { content }) => {
  if (res.output) return res;
  try {
    let output;
    const ast = babylon.parse(content, { sourceType: 'module' });
    traverse(ast, {
      Identifier: {
        enter(path) {
          if (path.node.name === 'entry') {
            let entryValue = content.slice(path.parent.value.start, path.parent.value.end);
            output = entryValue;
          }
        },
      },
    });
    res.output = output;
    return res;
  } catch (error) {
    return res;
  }
};
