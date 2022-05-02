const client = require('./../connection');

exports.getIndex = async (req, res) => {
  const indices = await client.indices.get({
    index: '_all',
  });

  res.status(200).render('index', {
    title: 'Index',
    indices: JSON.stringify(indices.mappings),
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
