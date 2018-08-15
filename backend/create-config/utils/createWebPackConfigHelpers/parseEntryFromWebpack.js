const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const fs = require('fs');
const path = require('path');

module.exports = (res, { content }) => {
  try {
    let entry;
    const ast = babylon.parse(content, { sourceType: 'module' });
    traverse(ast, {
      Identifier: {
        enter(traversePath) {
          if (traversePath.node.name === 'entry') {
            let entryValueInWebpackConfig = content
              .slice(traversePath.parent.value.start + 1, traversePath.parent.value.end - 1)
              .trim();
            let entryValuePlusRootDir = path.join(res.rootDir, entryValueInWebpackConfig);
            if (fs.existsSync(entryValueInWebpackConfig)) {
              entry = entryValueInWebpackConfig;
            } else if (fs.existsSync(entryValuePlusRootDir)) {
              entry = entryValuePlusRootDir;
            }
          }
        },
      },
    });
    if (entry) {
      res.entry = entry;
    }
    return res;
  } catch (error) {
    return res;
  }
};
