import React from 'react';
import { shell } from 'electron';
const path = require('path');
const upath = require('upath');

export default ({ dirname, bundleType }) => {
  console.log('inside helper func', dirname, bundleType);
  const dists = ['webpack-dist', 'parcel-dist', 'rollup-dist'];
  let webpackDist, parcelDist, rollupDist;
  if (dirname) {
    [webpackDist, parcelDist, rollupDist] = dists.map(dist =>
      upath.normalize(path.join(dirname, 'electronUserData', dist, 'package.json'))
    );
  }

  let dist_folder;
  let img;

  if (bundleType === 'webpack') {
    dist_folder = webpackDist;
    img = './assets/webpack_icon.png';
  } else if (bundleType === 'parcel') {
    dist_folder = parcelDist;
    img = './assets/parcel_icon.png';
  } else if (bundleType === 'rollup') {
    dist_folder = rollupDist;
    img = './assets/rollup_icon.png';
  }
  console.log(bundleType, dirname);
  console.log(webpackDist);
  console.log(parcelDist);
  console.log(rollupDist);

  return (
    <div>
      {(webpackDist || parcelDist || rollupDist) && (
        <div>
          <button
            className="barchart_btn"
            onClick={() => {
              shell.showItemInFolder(dist_folder);
            }}
          >
            <img className="btn_icon" src={img} />
            Download {bundleType} CONFIG
            <img className="btn_icon_download_config" src="./assets/file_icon.png" />
          </button>
        </div>
      )}
    </div>
  );
};
