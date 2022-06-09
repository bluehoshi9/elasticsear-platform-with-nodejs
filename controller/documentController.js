const client = require('./../connection');

exports.getDocument = async (req, res) => {
  try {
    //index
    const indices = await client.indices.get({
      index: '_all',
    });

    let indicesString = [];

    for (const index in indices) {
      indicesString.push(index);
    }
    indicesString = indicesString.map((el) => el.split('_').join(' '));

    //Delete document
    if (req.params.id) {
      await client.delete({
        index: req.params.index,
        id: req.params.id,
      });
      return res.redirect(req.get('referer'));
    }

    //Create document
    if (req.query.index) {
      let indexInput = req.query.index;
      let docidInput = req.query.docid;
      let fieldOneInput = req.query.field_1;
      let fieldTwoInput = req.query.field_2;
      let fieldThreeInput = req.query.field_3;
      let fieldFourInput = req.query.field_4;
      let fieldFiveInput = req.query.field_5;
      let fieldSixInput = req.query.field_6;
      let fieldSevenInput = req.query.field_7;
      let fieldEightInput = req.query.field_8;
      let fieldNineInput = req.query.field_9;
      let fieldTenInput = req.query.field_10;
      let fieldElevenInput = req.query.field_11;
      let fieldTwelveInput = req.query.field_12;
      let fieldThirteenInput = req.query.field_13;

      let createString = `{"index":"${indexInput}","id":"${docidInput}","body":{"Field One":"${fieldOneInput}","Field Two":"${fieldTwoInput}","Field Three":"${fieldThreeInput}","Field Four":"${fieldFourInput}","Field Five":"${fieldFiveInput}","Field Six":"${fieldSixInput}","Field Seven":"${fieldSevenInput}","Field Eight":"${fieldEightInput}","Field Nine":"${fieldNineInput}","Field Ten":"${fieldTenInput}","Field Eleven":"${fieldElevenInput}","Field Twelve":"${fieldTwelveInput}","Field Thirteen":"${fieldThirteenInput}"}}`;

      await client.index(JSON.parse(createString));
      return res.redirect(req.get('referer'));
    }

    //Query document
    let query = {};

    if (Object.keys(req.query).length === 0) {
      query = { match_all: {} };
    } else {
      query = { match: req.query };
    }

    const documents = await client.search({
      index: req.params.index,
      body: {
        size: 1,
        query: query,
      },
    });

    let documentHits = documents.hits.hits;
    //Extract keys and values
    const arrayOfKeys = Object.keys(documentHits[0]._source);

    const arrayOfValues = [];

    for (const document of documentHits) {
      delete document._score;
      arrayOfValues.push(
        Object.assign(
          {},
          Object.values(
            Object.assign(
              {},
              ...(function _flatten(o) {
                return [].concat(
                  ...Object.keys(o).map((k) =>
                    typeof o[k] === 'object' ? _flatten(o[k]) : { [k]: o[k] }
                  )
                );
              })(document)
            )
          )
        )
      );
    }

    //Number of columns
    const columnNumber = Object.keys(arrayOfValues[0]).length;

    const arrayOfNumbers = [];
    for (let i = 0; i < columnNumber; i++) {
      arrayOfNumbers.push(i);
    }

    res.status(200).render('document', {
      title: 'Document',
      indicesString,
      arrayOfKeys,
      arrayOfValues,
      documentHits,
      arrayOfNumbers,
    });
  } catch (err) {
    res.status(200).render('error', {
      title: 'Error',
      err,
    });
  }
};
