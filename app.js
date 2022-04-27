const express = require('express');
const indexRouter = require('./routes/indexRoutes');
const documentRouter = require('./routes/documentRoutes');

const app = express();
app.use(express.json());

app.use('/api/v1/index', indexRouter);
app.use('/api/v1/document', documentRouter);

module.exports = app;
