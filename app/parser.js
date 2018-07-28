const stats = require('./compilation-stats.json');

// console.log(stats.chunks)

let ctr = 0;
let node = {}

let objToTranslate = {};
// existingDir = {
//   name: x, children: [
//         { name: x, children: []  }]
//   }  
// };

stats.chunks[0].modules.forEach(element => {

    // console.log(element.id, element.size, ' kb ' , element.name, element.assets);

    // only include files that do not have the string "(ignored)"
    if(element.name.search("ignore") === -1) {
        let directoryAndName = element.name.replace(/[.\/]/, "");
        directoryAndName = directoryAndName.replace(/[.\/]/, "").split("/");
        console.log(directoryAndName, directoryAndName.length);
        // if (objToTranslate[])
        // create location in the object
        let location = ""
        for (let x = 0; x < directoryAndName.length - 1; x++){
            // don't include the last one, because it's the file itself, not the directory
            // this don't work... find a way to access this YO
            location = location.concat(".", directoryAndName[x])
        }
        console.log(location);
        if (!objToTranslate[location]){
            objToTranslate[location] = directoryAndName[directoryAndName.length-1];
        }
        console.log(objToTranslate)

 
    };
    console.log("final obj\n", objToTranslate);

    


    ctr++
});

console.log(stats.chunks[0].size, "------SIZE")
console.log(ctr, "total # of modules") // 451


// "moduleId": 16,
//               "moduleIdentifier": "/Users/bren/Codesmith/mockbuster/node_modules/core-js/modules/_string-html.js",