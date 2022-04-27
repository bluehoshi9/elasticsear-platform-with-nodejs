const client = require('./../connection');

exports.getAllIndices = async (req, res) => {
  try {
    const indices = await client.indices.get({
      index: '_all'
    });

    res.status(200).json({
      status: 'success',
      data: indices,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getIndex = async (req, res) => {
  try {
    const index = await client.indices.get({
      index: req.params.index,
    });

    res.status(200).json({
      status: 'success',
      data: index,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

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
