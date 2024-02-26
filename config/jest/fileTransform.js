// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en

'use strict';

const path = require('path');
const camelCase = require('camelCase');

module.exports = {
    process(src, filename) {
        const assetFilename = JSON.stringify(path.basename(filename));

        if (filename.match(/\.svg$/)) {
             // If the imported file has the .svg extension, generate a React component for it.
          const pascalCaseFilename = camelCase(path.parse(filename).name,{
            pascalCase: true,
          });
          const componentName = `Svg${pascalCaseFilename}`;

          // Return a React component using React.forwardRef.
           // This allows the component to receive a ref and pass it down to the underlying DOM element.
          return `const React = require('react');
          module.exports = {
            __esModule: true,
            default: ${assetFilename},
            ReactComponent: React.forwardRef((props, ref) => <${componentName} {...props} ref={ref} />),{
                return {
                    $$typeof: Symbol.for('react.element'),
                    type: 'svg',
                    ref: ref,
                    key: null,
                    props: Object.assign({}, props, {
                        children: ${assetFilename}
                    })  
                };
            }),
          } ;`;  
        }

         // If the imported file does not have the .svg extension, replace the imported file with its filename (as a JSON string).
        return `module.exports = ${assetFilename}`;
        },
    };