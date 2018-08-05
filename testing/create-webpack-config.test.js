const { indexFilesFromRoot } = require('../backend/create-config/process-and-bundle-project.js');

jest.setTimeout(10000);
const mockbusterPath = '/Users/bren/Codesmith/mockbuster';

let mockbusterFileIndexResult;
test('finds webpack config if it exists, and doesnt find config if it doesnt exist', done => {
  indexFilesFromRoot(mockbusterPath).then(res => {
    mockbusterFileIndexResult = res;
    expect(res.webpackConfig.exists).toBe(true);
    done();
  });
});
