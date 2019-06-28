require('babel-register')({
    presets: ['env', 'stage-2', 'react']
})
require('babel-polyfill')
require('dotenv').config()

module.exports = require('./server/index.js')