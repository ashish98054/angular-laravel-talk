(function() {
  'use strict';

  require('dotenv').config();

  const env   = process.env;
  const http  = require('http').Server();
  const io    = require('socket.io')(http, { host: env.REMOTE_IO_HOST, cache: false });
  const Redis = require('ioredis');
  const redis = new Redis({ host: env.REDIS_HOST });

  redis.psubscribe('*', (error, count) => {
    if (env.APP_DEBUG == 'true') {
      console.log('error ->', error);
      console.log('count ->', count);
    }
  });

  redis.on('pmessage', (pattern, channel, message) => {
    if (env.APP_DEBUG == 'true') {
      console.log('pattern ->', pattern);
      console.log('channel ->', channel);
      console.log('message ->', message);
    }
    message = JSON.parse(message);
    io.emit(message.event, channel, message.data);
  });

  http.listen({ port: env.REMOTE_IO_PORT });
}());
