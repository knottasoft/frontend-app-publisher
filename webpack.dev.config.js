const { createConfig } = require('@edx/frontend-build');
const Merge = require('webpack-merge');
const config = createConfig('webpack-dev');

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

//module.exports = config;

// module.exports = Merge.smart(config, {
//     devServer: {
//         host: '0.0.0.0',
//         port: 18400,
//         headers: {
//             'Access-Control-Allow-Origin': '*',
//         },
//         overlay: true,
//         disableHostCheck: true
//     },
// });
