const client = require('./../connection');

exports.createDocument = async (req, res) => {
  try {
    await client.index(req.body);

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

exports.deleteDocument = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.params.index);
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
