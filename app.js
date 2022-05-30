const express = require('express');
const path = require('path');
const indexRouter = require('./routes/indexRoutes');
const documentRouter = require('./routes/documentRoutes');
const viewRouter = require('./routes/viewRoutes');
const searchRouter = require('./routes/searchRoutes');

const app = express();
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRouter);
app.use('/api/v1/index', indexRouter);
app.use('/api/v1/document', documentRouter);
app.use('/api/v1/search', searchRouter);

// app.get('/searchES', function (req, res) {
//   var id = req.query.query_string;
//   console.log(id);
//   res.render('search', {
//     title: 'test',
//   });
// });
module.exports = app;
