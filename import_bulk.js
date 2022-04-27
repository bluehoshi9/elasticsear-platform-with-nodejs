const client = require('./connection.js');
const inputFile = require("./data/test.json");
let bulk = [];
let i = 0;

const makeBulk = (list, callback) => {
  for (let current in list) {
    bulk.push({
      index: {
        _index: 'olympic_events',
        // _id: list[current].ID
        _id: i
      }
    }, {
      'NOC': list[current].NOC,
      'Sex': list[current].Sex,
      'City': list[current].City,
      'Weight': list[current].Weight,
      'Name': list[current].Name,
      'Sport': list[current].Sport,
      'Games': list[current].Games,
      'Event': list[current].Event,
      'Height': list[current].Height,
      'Team': list[current].Team,
      'ID': list[current].ID,
      'Medal': list[current].Medal,
      'Age': list[current].Age
    });
    i++;
  }
  callback(bulk);
}

const indexAll = (makeBulk, callback) => {
  client.bulk({
    maxRetries: 5,
    index: 'gov',
    body: makeBulk
  }, (err, resp, status) => {
    if (err) {
      console.log(err);
    } else {
      callback(resp.items);
    }
  })
}

makeBulk(inputFile, (response) => {
  console.log("Bulk content prepared");
  indexAll(response, (response) => {
    console.log(response);
  })
});