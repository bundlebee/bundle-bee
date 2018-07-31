const stats = require('./compilation-stats.json');

  const statsx =[            {
    "id": 194,
    "identifier": "/Users/bren/Codesmith/mockbuster/node_modules/urlencode/lib/urlencode.js",
    "name": "./node_modules/urlencode/lib/urlencode.js",
    "profile": {
      "factory": 759,
      "building": 53,
      "dependencies": 677
    }
  },
  {
    "id": 194,
    "identifier": "/Users/bren/Codesmith/mockbuster/node_modules/urlencode/lib/urlencode.js",
    "name": "./src/whatever.js",
    "profile": {
      "factory": 759,
      "building": 53,
      "dependencies": 677
    }
  },
  {
    "id": 194,
    "identifier": "/Users/bren/Codesmith/mockbuster/node_modules/urlencode/lib/urlencode.js",
    "name": "./src/22222.js",
    "profile": {
      "factory": 759,
      "building": 53,
      "dependencies": 677
    }
  },
  ,
  {
    "id": 194,
    "identifier": "/Users/bren/Codesmith/mockbuster/node_modules/urlencode/lib/urlencode.js",
    "name": "./src/33333.js",
    "profile": {
      "factory": 759,
      "building": 53,
      "dependencies": 677
    }
  },
  {
    "id": 194,
    "identifier": "/Users/bren/Codesmith/mockbuster/node_modules/urlencode/lib/urlencode.js",
    "name": ".index.js",
    "profile": {
      "factory": 759,
      "building": 53,
      "dependencies": 677
    }
  }]
// ./node_modules/warning/warning.js
// ./src/actions/actions.js"
  
  function Node(name, size = null, speed = null) {
      this.name = name;
    //   this.size = size;
    //   this.speed = speed;
      this.children = [];
  }

  let objToTranslate = new Node("root")
//   objToTranslate.children.push(new Node(6, 7, 8))
  // console.log(objToTranslate);
  // console.log(Object.values(objToTranslate.children), "OBJECT KEYS OF CHILDREN");

// REAL FILE
  stats.chunks[0].modules.forEach(element => {
    // stats.forEach(element => {

    console.log( element.size, ',',  element.name);

//     // only include files that do not have the string "(ignored)"
var root = { "name": "root", "children": [] };

    if(element.name.search("ignore") === -1) {
        let directoryAndName = element.name.replace(/[.\/]/, "");
        let parts  = directoryAndName.replace(/[.\/]/, "").split("/");
        // console.log(directoryAndName, directoryAndName.length);
    }
        // let location = objToTranslate; //.children;
        // console.log(location, "loc");
        // for (let x = 0; x < directoryAndName.length - 1; x++){
        //      // don't include the last one, because it's the file itself, not the directory
        //      // this don't work... find a way to access this YO
        //     //  objToTranslate.children.push(new Node(directoryAndName[x]));
        //     console.log(location.children)
        //     location.children.push(new Node(directoryAndName[x]));
            
        //     location = location.children[0];
        //     console.log(location);


        //  }
          
        //   console.log(objToTranslate.children, "children") //.children[objToTranslate.children.length-1].name)
    //     var currentNode = root;
    //     for (var j = 0; j < parts.length; j++) {

            
    //       var children = currentNode["children"];
    //       var nodeName = parts[j];
    //       var childNode;
    //       if (j + 1 < parts.length) {
    //         // Not yet at the end of the sequence; move down the tree.
    //         var foundChild = false;
    //         for (var k = 0; k < children.length; k++) {
    //           if (children[k]["name"] == nodeName) {
    //             childNode = children[k];
    //             foundChild = true;
    //             break;
    //           }
    //         }
    //         // If we don't already have a child node for this branch, create it.
    //         if (!foundChild) {
    //           childNode = { "name": nodeName, "children": [] };
    //           children.push(childNode);
    //         }
    //         currentNode = childNode;
    //       } else {
    //         // Reached the end of the sequence; create a leaf node.
    //         childNode = { "name": nodeName, "size": 123456 };
    //         children.push(childNode);
    //       }
    //     }
 
    // };
    // console.log(root)

    


});

// console.log(stats.chunks[0].size, "------SIZE")
// console.log(ctr, "total # of modules") // 451


// "moduleId": 16,
//               "moduleIdentifier": "/Users/bren/Codesmith/mockbuster/node_modules/core-js/modules/_string-html.js",