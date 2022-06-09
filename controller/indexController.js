const client = require('./../connection');

exports.getIndex = async (req, res) => {
  try {
    //Delete index
    if (req.params.index) {
      await client.indices.delete({
        index: req.params.index,
      });

      return res.redirect(req.get('referer'));
    }

    //Create index
    if (req.query.new_index) {
      let createString = req.query.new_index;
      createString = createString.toLowerCase().split(' ').join('_');
      createString = `{"index":"${createString}"}`;

      await client.indices.create(JSON.parse(createString));
      return res.redirect(req.get('referer'));
    }

    //Query index
    const indices = await client.indices.get({
      index: '_all',
    });

    let indicesString = [];

    for (const index in indices) {
      indicesString.push(index);
    }
    indicesString = indicesString.map((el) => el.split('_').join(' '));

    res.status(200).render('index', {
      title: 'Index',
      indicesString,
    });
  } catch (err) {
    res.status(200).render('error', {
      title: 'Error',
      err,
    });
  }
};
