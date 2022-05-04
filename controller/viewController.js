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

exports.getDocument = (req, res) => {
  res.status(200).render('document', {
    title: 'Document',
  });
};

exports.doSearch = (req, res) => {
  res.status(200).render('document', {
    title: 'Search',
  });
};
