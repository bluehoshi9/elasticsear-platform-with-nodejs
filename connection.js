const es = require('elasticsearch');

const client = new es.Client({
  host: 'elastic:123456@localhost:9200',
  requestTimeout: 2147483647,
});

module.exports = client;
