const express = require('express');
const path = require('path');
const indexRouter = require('./routes/indexRoutes');
const documentRouter = require('./routes/documentRoutes');
const viewRouter = require('./routes/viewRoutes');
const searchRouter = require('./routes/searchRoutes');
const client = require('./connection');

const app = express();
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRouter);
app.use('/api/v1/index', indexRouter);
app.use('/api/v1/document', documentRouter);
app.use('/api/v1/search', searchRouter);

app.get('/test/:id?', async function (req, res) {
  //delete
  if (req.params.id) {
    await client.delete({
      index: 'olympic_events',
      id: req.params.id,
    });
    return res.redirect(req.get('referer'));
  }

  //Create doc
  if (req.query.index) {
    let indexInput = req.query.index;
    let docidInput = req.query.docid;
    let nocInput = req.query.noc;
    let sexInput = req.query.sex;
    let cityInput = req.query.city;
    let weightInput = req.query.weight;
    let nameInput = req.query.name;
    let sportInput = req.query.sport;
    let gamesInput = req.query.games;
    let eventInput = req.query.event;
    let heightInput = req.query.height;
    let teamInput = req.query.team;
    let idInput = req.query.id;
    let medalInput = req.query.medal;
    let ageInput = req.query.age;

    let createString = `{"index":"${indexInput}","id":"${docidInput}","body":{"noc":"${nocInput}","sex":"${sexInput}","city":"${cityInput}","weight":"${weightInput}","name":"${nameInput}","sport":"${sportInput}","games":"${gamesInput}","event":"${eventInput}","height":"${heightInput}","team":"${teamInput}","id":"${idInput}","medal":"${medalInput}","age":"${ageInput}"}}`;

    console.log(createString);

    await client.index(JSON.parse(createString));
    return res.redirect(req.get('referer'));
  }

  //query
  let query = {};

  if (Object.keys(req.query).length === 0) {
    query = { match_all: {} };
  } else {
    query = { match: req.query };
  }

  const documents = await client.search({
    index: req.params.index,
    body: {
      size: 100,
      query: query,
    },
  });

  let documentHits = documents.hits.hits;

  res.status(200).render('test', {
    title: 'Test',
    documentHits,
  });
});
module.exports = app;
