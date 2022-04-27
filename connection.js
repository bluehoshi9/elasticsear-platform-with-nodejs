const es = require('elasticsearch');

const client = new es.Client({
  host: 'elastic:123456@localhost:9200',
});

module.exports = client;
