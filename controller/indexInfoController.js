const { json } = require('express/lib/response');
const client = require('./../connection');

exports.getIndexInfo = async (req, res) => {
  try {
    let arrField = [];
    let arrType = [];
    let typeObj = {};

    const infoObj = await client.indices.get({
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

    const numberOfShards =
      infoObj[`${req.params.index}`].settings.index.number_of_shards;
    const numberOfReplicas =
      infoObj[`${req.params.index}`].settings.index.number_of_shards;
    const creationDate = new Date(
      +infoObj[`${req.params.index}`].settings.index.creation_date
    );
    const uuid = infoObj[`${req.params.index}`].settings.index.uuid;

    res.status(200).render('indexInfo', {
      title: 'Index Information',
      numberOfShards,
      numberOfReplicas,
      creationDate,
      uuid,
      arrField,
      typeObj,
      index: req.params.index,
    });
  } catch (err) {
    res.status(200).render('error', {
      title: 'Error',
      err,
    });
  }
};
