'use strict';

const 
  Message = require('./Message'),
  config = require('./config.json'),
  rabbit = require('./rabbit'),
  telegram = require('./telegram');

// Listen for url on queue
rabbit.sub('url')

// Listen for messages