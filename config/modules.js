'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');
const chalk = require('react-dev-utils/chalk');

/**
 * Get the baseUrl of a compilerOptions object.
 * 
 *  @param {Object} options
 */
function getAdditionalModulePaths(options = {}) {
    const baseUrl = options.baseUrl;

// Check for null and undefined
// Typescript treats an empty string as `.`.
if (baseUrl == null) {
   // baseUrl not set
   // return empty array
   // Note: it might be useful to return an object
   // with the default value instead of an empty array
   // to avoid confusion.

    const nodePath = process.env.NODE_PATH || '';
    return nodePath.split(path.delimiter).filter(Boolean);
}

const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

// baseUrl can be relative (path.resolve doesn't do this)
// if it is, prepend the current path
// eslint-disable-next-line no-bitwise

if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null;
} 
// Check if baseUrl is a URL
// if it is, make the path absolute
// if it isn't, assume it's a directory
// and resolve the path from there
// eslint-disable-next-line no-bitwise
if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc];
}
// Otherwise, throw an error
throw new Error(
    chalk.red.bold(
        "Your project's 'baseUrl' can only be set to 'src' or 'node_modules'." +
        ' Create React App does not support other values at this time.'
    )
);
}

function getModules() {
    // Check if TypeScript is setup
    const hasTsConfig = fs.existsSync(paths.appTsConfig);
    const hasJsConfig = fs.existsSync(paths.appJsConfig);

    if (hasTsConfig && hasJsConfig) {
        throw new Error(
            'You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.'
        );
    }

    let config;
    // If there's no tsconfig.json we'll fallback to the jsconfig.json
    if (hasTsConfig) {
        config = require(paths.appTsConfig);
        // Check if the user has a react-scripts.config.js
        // https://github.com/facebook/create-react-app/issues/901
        // if there is a tsconfig.json we assume it is
        // TypeScript project and set up the config
        // based on tsconfig.json
    } else if (hasJsConfig) {
        config = require(paths.appJsConfig);
    }

    config = config || {};
  const options = config.compilerOptions || {};

  const additionalModulePaths = getAdditionalModulePaths(options);

  return {
    additionalModulePaths: additionalModulePaths,
    hasTsConfig,
  };
}

module.exports = getModules();
