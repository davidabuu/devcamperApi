const NodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formater: null
}

const geCoder = NodeGeocoder(options);


module.exports = geCoder;