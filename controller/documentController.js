const client = require('./../connection');

exports.getDocument = async (req, res) => {
  try {
    const doc = await client.get({
      index: req.params.index,
      id: req.params.id,
    });

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createDocument = async (req, res) => {
  try {
    const doc = await client.index(req.body);

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const docUpdate = await client.update({
      index: req.params.index,
      id: req.params.id,
      body: { doc: req.body },
    });

    res.status(200).json({
      status: 'success',
      data: docUpdate,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await client.delete({
      index: req.params.index,
      id: req.params.id,
    });

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    let query = {};

    if (Object.keys(req.query).length === 0) {
      query = { match_all: {} };
    } else {
      query = changeQueryString(req.query);
    }

    const documents = await client.search({
      index: req.params.index,
      body: {
        size: 100,
        query: query,
      },
    });

    res.status(200).json({
      results: documents.hits.hits.length,
      status: 'success',
      data: documents.hits.hits,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

function changeQueryString(origin) {
  const result = {
    bool: {
      must: [],
    },
  };
  for (const key in origin) {
    result.bool.must.push({ match: { [key]: origin[key] } });
  }
  return result;
}
