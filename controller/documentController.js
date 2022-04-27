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
