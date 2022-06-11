const client = require('./../connection');

exports.getIndex = async (req, res) => {
  try {
    //Temp
    let infoObj = {};
    let arrField = [];
    let arrType = [];
    let typeObj = {};
    if (req.params.index) {
      infoObj = await client.indices.getMapping({
        index: req.params.index,
      });
      const fieldsObj = infoObj[`${req.params.index}`].mappings.properties;

      for (const field in fieldsObj) {
        arrField.push(`${field}`);
        arrType.push(`${fieldsObj[field].type}`);
      }
      arrField.forEach((element, index) => {
        typeObj[element] = arrType[index];
      });
    }

    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //Delete index
    if (req.params.index && fullUrl.includes('delete')) {
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
      typeObj,
      arrField,
    });
  } catch (err) {
    res.status(200).render('error', {
      title: 'Error',
      err,
    });
  }
};
