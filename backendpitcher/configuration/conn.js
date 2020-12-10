//fetching configuration details
var configuration = require('./conn.json')

//checking the environment
var env = process.env.NODE_ENV || 'development';

//configuring the environment
var envconfig = configuration[env];

Object.keys(envconfig).forEach(key => process.env[key] = envconfig[key]);
