const client = require('./../../connection');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('events_lowercase.json'));

for (var i = 0; i < data.length; i++) {
  client.create(
    {
      index: 'olympic_events',
      id: i,
      body: data[i],
    },
    function (error, response) {
      if (error) {
        console.error(error);
        return;
      } else {
        console.log(response);
      }
    }
  );
}

console.log('Import Done');
