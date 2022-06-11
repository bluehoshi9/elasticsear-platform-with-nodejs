const express = require('express');
const path = require('path');
const multer = require('multer');
const client = require('./connection');
const fs = require('fs');

const indexRouter = require('./routes/indexRoutes');
const documentRouter = require('./routes/documentRoutes');
const searchRouter = require('./routes/searchRoutes');
const infoRouter = require('./routes/indexInfoRoutes');

const app = express();
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/document', documentRouter);
app.use('/search', searchRouter);
app.use('/info/', infoRouter);

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
  try {
    let createString = req.body.new_index;
    createString = createString.toLowerCase().split(' ').join('_');

    const data = JSON.parse(
      fs.readFileSync(__dirname + `/uploads/${req.file.filename}`)
    );

    for (let i = 0; i < data.length; i++) {
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
  } catch (err) {
    res.status(200).render('error', {
      title: 'Error',
      err,
    });
  }
});

module.exports = app;
