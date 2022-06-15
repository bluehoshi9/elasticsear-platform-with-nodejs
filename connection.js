const es = require('elasticsearch');

const client = new es.Client({
  host: 'elastic:123456@localhost:9200',
  //hosts: ['https://phunghx:abc123@54.164.183.99:9200'],
  requestTimeout: 2147483647,
});

module.exports = client;
