export const parseWebpackOutput = (data, bundleDir) => {
  // console.log('@ parseWebpackOutput');
  const total = { size: 0, factory: 0, building: 0 };
  total.totalElapsedTime = data.time;
  total.totalBundleSize = data.assets.reduce((acc, asset) => acc + asset.size, 0);
  // console.log('@ webpack size', total.totalBundleSize);

  const rootData = { name: 'rootData', children: [] };
  console.log('bundleDir: ' + bundleDir);
  data.chunks[0].modules.filter(x => !x.name.includes('C:/') && !x.name.includes('..') && x.name.slice(0, 3) !== 'css' && !x.name.includes(bundleDir)).forEach(element => {
    let directoryAndName = element.name.replace(/\.\//, '');
    let parts = directoryAndName.split('/');

    var currentNode = rootData;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode['children'];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        var foundChild = false;
        for (var k = 0; k < children.length; k++) {
          if (children[k]['name'] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        const size = element.size || 0;
        const factory = element.profile ? element.profile.factory : 0;
        const building = element.profile ? element.profile.building : 0;

        total.size += Number(size);
        total.factory += Number(factory);
        total.building += Number(building);
        childNode = { name: nodeName, size, factory, building };
        children.push(childNode);
      }
    }
  });

  return { hierarchicalData: rootData, total: total };
};

// parse our own custom parcel output. parcel doesn't keep track of factory times.
export const parseParcelOutput = (data, bundleDir) => {
  // console.log('@ parseParcelOutput');
  const total = { size: 0, building: 0 };
  total.totalElapsedTime = data.totalElapsedTime;
  total.totalBundleSize = data.totalBundleSize;
  // console.log('@ parcel size', total.totalBundleSize);

  const rootData = { name: 'rootData', children: [] };
  data.files
    .slice()
    .filter(x => !x.name.includes('..')) // revised filter for not including the entirety of bundle bee
    .forEach(element => {
      let directoryAndName = element.name.replace(/\\/g, '/');
      let parts = directoryAndName.split('/');

      var currentNode = rootData;
      for (var j = 0; j < parts.length; j++) {
        var children = currentNode['children'];
        var nodeName = parts[j];
        var childNode;
        if (j + 1 < parts.length) {
          // Not yet at the end of the sequence; move down the tree.
          var foundChild = false;
          for (var k = 0; k < children.length; k++) {
            if (children[k]['name'] == nodeName) {
              childNode = children[k];
              foundChild = true;
              break;
            }
          }
          // If we don't already have a child node for this branch, create it.
          if (!foundChild) {
            childNode = { name: nodeName, children: [] };
            children.push(childNode);
          }
          currentNode = childNode;
        } else {
          // Reached the end of the sequence; create a leaf node.
          const size = element.bundledSize || 0;
          const building = element.buildTime;

          total.size += Number(size);
          total.building += Number(building);
          childNode = { name: nodeName, size, building };
          children.push(childNode);
        }
      }
    });

  return { hierarchicalData: rootData, total: total };
};

export const parseRollupOutput = data => {
  // console.log('@ parseRollupOutput');
  const total = { size: 0, building: 0 };
  total.totalElapsedTime = data.totalElapsedTime;
  total.totalBundleSize = data.totalBundleSize;
  // console.log('@ rollup size', total.totalBundleSize);

  const rootData = { name: 'rootData', children: [] };
  data.files.slice().forEach(element => {
    let directoryAndName = element.name.replace(/\\/g, '/');
    let parts = directoryAndName.split('/');

    var currentNode = rootData;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode['children'];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        var foundChild = false;
        for (var k = 0; k < children.length; k++) {
          if (children[k]['name'] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        const size = element.size || 0;
        const building = element.time;

        total.size += Number(size);
        total.building += Number(building);
        childNode = { name: nodeName, size, building };
        children.push(childNode);
      }
    }
  });

  return { hierarchicalData: rootData, total: total };
};
