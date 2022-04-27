const client = require('./connection.js');
const fs = require("fs");
const data = JSON.parse(fs.readFileSync('./data/test.json'))

for (var i = 0; i < data.length; i++) {
  client.create({
    index: "olympic_events3",
    id: i,
    body: data[i]
  }, function (error, response) {
    if (error) {
      console.error(error);
      return;
    } else {
      console.log(response);
    }
  });
}