module.exports = (res, path) => {
  res.entry = path !== 'undefined' ? path : res.entry;
  return res;
};
