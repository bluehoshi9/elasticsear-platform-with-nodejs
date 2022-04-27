const client = require('./../connection');

exports.createIndex = async (req, res) => {
  try {
    await client.indices.create(req.body);

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteIndex = async (req, res) => {
  try {
    await client.indices.delete({
      index: req.params.index,
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
