const express = require('express');
const path = require('path');
const multer = require('multer');
const client = require('./connection');
const fs = require('fs');
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get('/upload', function (req, res) {
  res.status(200).render('upload', {
    title: 'Upload',
  });
});

app.post('/upload/:index?', upload.single('myFile'), (req, res, next) => {
  let createString = req.body.new_index;
  createString = createString.toLowerCase().split(' ').join('_');

  const data = JSON.parse(
    fs.readFileSync(__dirname + `/uploads/${req.file.filename}`)
  );

  console.log(data);
  console.log(createString);
  for (let i = 0; i < data.length; i++) {
    console.log();
    client.create(
      {
        index: createString,
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

  res.redirect('/upload');
});

module.exports = app;
