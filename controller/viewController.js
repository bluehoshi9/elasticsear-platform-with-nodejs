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

  let nocArr = [];
  for (let i = 2; i < final.length; i += 3) {
    nocArr.push(final[i].noc);
  }
  console.log(nocArr);

  let newData = [];
  for (let i = 0; i < final.length; i += 3) {
    let three = [];
    three.push(final[i]);
    three.push(final[i + 1]);
    three.push(JSON.stringify(final[i + 2]));

    newData.push(three);
  }

  res.status(200).render('document', {
    title: 'Document',
    newData,
  });
};

exports.doSearch = async (req, res) => {
  res.status(200).render('search', {
    title: 'Search',
  });
};
