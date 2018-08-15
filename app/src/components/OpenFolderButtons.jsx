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
    <div className="rounded_div">
    <h3>Download Files</h3>
      <button
        onClick={() => {
          shell.showItemInFolder(webpackDist);
        }}
      >
                  <img className="btn_icon" src="./assets/webpack_icon.png" />
        Webpack Files
      </button>
      <button
        onClick={() => {
          shell.showItemInFolder(parcelDist);
        }}
      >
                  <img className="btn_icon" src="./assets/parcel_icon.png" />

        Parcel Files
      </button>
      <button
        onClick={() => {
          shell.showItemInFolder(rollupDist);
        }}
      >
                 <img className="btn_icon" src="./assets/rollup_icon.png" />

        Rollup Files
      </button>
    </div>
  );
};

