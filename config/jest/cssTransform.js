'use strict';

// This is a custom jest transform that is used to transform CSS imports
// into require calls. This is needed because CSS imports are not
// transpiled by Babel.

module.exports = {
    process() {
        return 'module.exports = {}';
    },
    getCacheKey() {
        // Return a unique identifier for the transformer
        // which helps jest manage caching
                return 'cssTransform';
    },
};