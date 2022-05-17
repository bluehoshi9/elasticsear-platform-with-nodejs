const client = require('./../connection');

exports.multiMatch = async (req, res) => {
  try {
    const queryString = req.query;

    const documents = await client.search({
      index: req.params.index,
      body: {
        query: {
          multi_match: {
            query: queryString.query_string,
            fields: ['*'],
          },
        },
      },
    });

    res.status(200).json({
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
