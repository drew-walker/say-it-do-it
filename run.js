if (process.env.NEW_RELIC_LICENSE_KEY) {
    console.log('New Relic agent started')
    require('newrelic');
}

var www = require('./src/www.js');
www.start(process.env.PORT || 5000);