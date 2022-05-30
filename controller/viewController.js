const client = require('./../connection');

exports.getIndex = async (req, res) => {
  const indices = await client.indices.get({
    index: '_all',
  });

  const final = [];

  for (const index in indices) {
    final.push(index);
  }

  res.status(200).render('index', {
    title: 'Index',
    final,
  });
};

exports.getDocument = async (req, res) => {
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

  const final = [];
  documentHits.forEach((element) => {
    final.push(element._index);
    final.push(element._id);
    final.push(element._source);
  });

  let newData = [];
  for (let i = 0; i < final.length; i += 3) {
    let three = [];
    three.push(final[i]);
    three.push(final[i + 1]);
    three.push(Object.keys(final[i + 2]).map((key) => final[i + 2][key]));

    newData.push(three);
  }

  for (let i = 0; i < newData.length; i++) {
    newData[i] = newData[i].flat();
  }

  res.status(200).render('document', {
    title: 'Document',
    newData,
  });
};

exports.doSearch = async (req, res) => {
  let queryString = '';

  if (!req.query.query_string) {
    queryString = '';
  } else {
    queryString = req.query.query_string;
  }

  const documents = await client.search({
    index: req.params.index,
    body: {
      size: 100,
      query: {
        multi_match: {
          query: queryString,
          fields: ['*'],
        },
      },
    },
  });

  let documentHits = documents.hits.hits;

  const final = [];
  documentHits.forEach((element) => {
    final.push(element._index);
    final.push(element._id);
    final.push(element._source);
  });

  let newData = [];
  for (let i = 0; i < final.length; i += 3) {
    let three = [];
    three.push(final[i]);
    three.push(final[i + 1]);
    three.push(Object.keys(final[i + 2]).map((key) => final[i + 2][key]));

    newData.push(three);
  }

  for (let i = 0; i < newData.length; i++) {
    newData[i] = newData[i].flat();
  }
  res.status(200).render('search', {
    title: 'Search',
    newData,
  });
};

// document.querySelector('.search-box ').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const query = document.getElementById('text').value;
//   console.log(query);
// });
