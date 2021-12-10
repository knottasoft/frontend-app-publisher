const { createConfig } = require('@edx/frontend-build');
const config = createConfig('webpack-prod');
//const path = require('path');
//const ReactIntlPlugin = require('webpack-plugin-react-intl')

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

// config.module.rules.push({
//         type: 'javascript/auto',
//         test: /\.json$/,
//         include: [
//             path.resolve(__dirname, '../src/i18n/messages'),
//         ],
//         loader: 'file-loader',
//         options: {
//             name: '[name].[ext]',
//             outputPath: '/i18n/messages/',
//         },
//     },
// )

// config.plugins = [
//     new ReactIntlPlugin({
//         source: './dist/messages',
//         destination: './src/i18n/messages/*'
//     })
// ]

module.exports = config;
