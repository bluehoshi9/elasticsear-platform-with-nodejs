const client = require('./../../connection');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('test_four.json'));

for (var i = 0; i < data.length; i++) {
  client.create(
    {
      index: 'new_index',
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