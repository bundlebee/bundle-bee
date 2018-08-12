import React from 'react';
import { shell } from 'electron';
const path = require('path');
const upath = require('upath');

export default ({ dirname }) => {
  const dists = ['webpack-dist', 'parcel-dist', 'rollup-dist'];
  let webpackDist, parcelDist, rollupDist;
  if (dirname) {
    [webpackDist, parcelDist, rollupDist] = dists.map(dist =>
      upath.normalize(path.join(dirname, 'electronUserData', dist, 'package.json'))
    );
  }
  return (
    <div>
      <button
        onClick={() => {
          shell.showItemInFolder(webpackDist);
        }}
      >
        Webpack Files
      </button>
      <button
        onClick={() => {
          shell.showItemInFolder(parcelDist);
        }}
      >
        Parcel Files
      </button>
      <button
        onClick={() => {
          shell.showItemInFolder(rollupDist);
        }}
      >
        Rollup Files
      </button>
    </div>
  );
};
