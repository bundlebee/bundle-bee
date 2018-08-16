# BUNDLE BEE

Bundle Bee is an intuitive program that takes in your javascript project and automatically configures and runs it through popular bundlers, and then provides an interactive analysis tool after to help you compare your bundle composition, speed times and file sizes in each respective bundler, allowing you to choose the best bundler for your needs and migrate with zero-configuration and zero-hassle.  Currently compatible with Webpack, Parcel and Rollup - our program will give you the needed configuration and build files to get started and launch with whichever bundler best suits your needs.

### Getting Started: _Auto-config your webpack, parcel & rollup build tools._

These instructions will get you a copy of the project up and running on your local machine.

### Requirements
Bundle Bee is currently only compatible with javascript projects using vanilla JS, React, SASS/SCSS, LESS, CSS, and standard image types. Application requiring javascript module loading of other file types are likely to encounter errors during bundling. The application is available in two formats: As a downloadable .app file for MacOS, and as an electron application launched from the terminal using npm or yarn.

### Installing
Download the mac app from bundlebee.io, 

OR

copy our repo to your local machine:

```
git clone https://github.com/bundlebee/bundle-bee.git bundle-bee
```

cd into the directory and install the dependencies

```
cd bundle-bee
```
```
npm i || yarn
```
Then boot up the application:
```
npm run electron || yarn electron
```
After that, just drop your project folder into the electron app window, and let the bundler do the work. Bundle Bee will attempt to locate your entry file automatically, and you will be prompted to drop it in if we are unable to determine this. Additionally, if an existing configuration file is found, Bundle Bee will ask whether you would like to use that, or if you would like us to automatically generate a new configuration file for you. Speed and size data for each bundler displays on the screen as each bundler finishes its process. Navigate between the three bundlers using the top three buttons, and switch between build sizes and speeds using the lower three buttons broken down by asset. A broad overview bar chart of the total build times and sizes is available on the 'totals' tab, which displays a snapshot comparison of the three bundlers' results.

After a preferred bundler has been chosen, click one of the 'view configuration' buttons on the right side of the screen to open up the project files folder specific to that bundler, which provides:

1) The configuration file used to bundler your project
2) The build files produced by each bundler
3) a package.json that includes all of the additional devDependencies required to run the bundler


### Troubleshooting
If you encounter an error running Bundle Bee on your project, first check to see that:

1) Your project does not import modules of unsupported file types or format (javascript es6+ up to stage-0 proposals, React, SASS/SCSS/CSS/LESS)
2) Your imports are all es6 imports, commonJS imports (node), UMD or AMD format, and no dynamic imports are used
3) Your project does not have any errors prior to bundling

Additionally, there are some limitations in the individual bundlers that may be affecting the bundling process. It is beyond the scope of this document to cover all of these (consult the relevant docs for each bundler)

https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
https://github.com/webpack/docs/wiki/troubleshooting
https://github.com/parcel-bundler/parcel/issues

but some common issues are below:

- In some cases, Parcel encounters errors in resolving url paths in SASS/SCSS if the path is absolute, or if it uses single or double quotes
- When destructuring some named exports from node modules (e.g, 'import { render } from 'react-dom';), rollup may encounter an error. We have included some rules to account for this in our configuration, such as the most common examples in React, but obviously there is no way to anticipate what will be in your project in advance. To add more named exports to your rollup config, please add them to the commonjs plugin in the rollup config as follows:
```
commonjs({
     include: 'node_modules/**',
     namedExports: {
       'node_modules/react-dom/index.js': ['render', 'findDOMNode'],
     },
```
- There is no hard and fast rule yet for how to order rollup plugins to ensure they will run properly. We attempted to find the order that resolves the most cases, but you may need to reorder the rollup plugins to see what works with your project.

And finally, Bundle Bee is still in development, so bear with us as we iron out all the kinks!

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Brendan Morrell** (https://github.com/brendanmorrell)

* **Clariz Mariano** (https://github.com/havengoer)

* **Sam Goldberg** (https://github.com/sgoldber61)

* **Adam Modras** (https://github.com/js-mode)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hats off to https://twitter.com/michalhudecek for providing the bundle bee image!
