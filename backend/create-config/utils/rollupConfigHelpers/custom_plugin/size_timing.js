const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

console.log('ENTERING SIZE TIMING PLUGIN');

// attempt 1
// const data = {};


// attempt 2
const packets = [];
let currPacket;
let loadQ = false;
let completeQ = false;

// results for attempt 2
const fileMap = new Map();


// write sizeTimingPlugin functionality
const sizeTimingPlugin = () => {
  // return properties
  return {
    name: 'Custom size-timing plugin',
    buildStart: () => {
      console.log('build start');
    },
    resolveId: (importee, importer) => {
      // console.log('resolveId: ' + importee);
    },
    load: (id) => {
      // attempt 1
      // data[id] = {begin: Date.now()};
      
      // attempt 2
      // switch to loading mode
      // console.log('loading ' + id);
      if (!loadQ) {
        loadQ = true;
        completeQ = false;
        currPacket = {begin: Date.now(), ids: []};
        packets.push(currPacket);
      }
      
      // add id (file path) to ids set to keep track of files that are being loaded
      currPacket.ids.push(id);
    },
    transform: (source, id) => {
      // attempt 1
      // if (/\u0000commonjs-proxy:/.test(id)) { // check for prefix '\u0000commonjs-proxy:'
      //   trimmedId = id.replace(/\u0000commonjs-proxy:/, '');
      //   data[id] = {postElapse: Date.now() - (data[trimmedId] ? data[trimmedId].begin + data[trimmedId].elapsed : 0)};
      // }
      // else {
      //   if (data[id]) {
      //     data[id].elapsed = Date.now() - data[id].begin;
      //   }
      //   else {
      //     data[id] = {end: Date.now()};
      //   }
      // }
      
      // attempt 2
      // switch to transform mode
      // console.log('transforming ' + id);
      if (loadQ) {
        loadQ = false;
        currPacket.end = Date.now();
        currPacket.elapsed = currPacket.end - currPacket.begin;
      }
      
      // check for prefix '\u0000commonjs-proxy:' followed by url that exists in the current packet ids set
      if (!completeQ && /\u0000commonjs-proxy:/.test(id)) {
        const trimmedId = id.replace(/\u0000commonjs-proxy:/, '');
        if (currPacket.ids.includes(trimmedId)) {
          currPacket.completeEnd = Date.now();
          currPacket.completeElapsed = currPacket.completeEnd - currPacket.begin;
          completeQ = true;
        }
      }
    },
    buildEnd: () => {
      // attempt 1
      // fs.writeFileSync(path.join(__dirname, 'data1.json'), JSON.stringify(data, null, 2));
      
      // attempt 2
      // post-processing
      const files = [];
      
      packets.forEach(packet => {
        const time = (packet.completeElapsed || packet.elapsed) / packet.ids.length;
        packet.ids.forEach(id => {
          files.push({name: path.relative(rootDir, id), time});
          
          fileMap.set(path.relative(rootDir, id), time);
        });
        
      });
      
      console.log('total accumulated time:');
      console.log(files.reduce((acc, next) => acc + next.time, 0));
      
      // write to file
      // fs.writeFileSync(path.join(__dirname, 'data2.json'), JSON.stringify(packets, null, 2));
      // fs.writeFileSync(path.join(__dirname, 'data3.json'), JSON.stringify(files, null, 2));
    },
    generateBundle: (outputOptions, bundle, isWrite) => {
      const modules = bundle['bundle.js'].modules;
      const bundleFiles = Object.keys(modules);
      
      const fileSizes = bundleFiles.map(key => {
        return {name: path.relative(rootDir, key), size: modules[key].renderedLength};
      });
      
      const fileTimesSizes = bundleFiles.map(key => {
        const name = path.relative(rootDir, key);
        return {name, size: modules[key].renderedLength, time: fileMap.get(name)};
      }).filter(item => {
        return !(/\u0000commonjs/.test(item.name));
      });
      
      // zip contents together
      
      
      // fs.writeFileSync(path.join(__dirname, 'data4.json'), JSON.stringify(fileSizes, null, 2));
      fs.writeFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'electronUserData', 'cwd.json'), JSON.stringify(rootDir, null, 2));
      fs.writeFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'electronUserData', 'rollup-stats.json'), JSON.stringify(fileTimesSizes, null, 2));
    }
  };
};

module.exports = sizeTimingPlugin;

