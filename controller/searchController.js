const client = require('./../connection');

exports.doSearch = async (req, res) => {
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

    //search
    if (!req.query.limit) {
      req.query.limit = 100;
    }
    let queryString = '';

    if (!req.query.query_string) {
      queryString = '';
    } else {
      queryString = req.query.query_string;
    }

    const documents = await client.search({
      index: req.params.index,
      body: {
        size: req.query.limit,
        query: {
          multi_match: {
            query: queryString,
            fields: ['*'],
          },
        },
      },
    });

    let searchAction = '';
    if (!req.params.index) {
      searchAction = '/search/';
    } else {
      searchAction = `/search/${req.params.index}`;
    }

    let documentHits = documents.hits.hits;
    if (queryString == '') documentHits = []; //Bug

    let arrayOfKeys = [];
    let arrayOfValues = [];
    let arrayOfNumbers = [];
    if (documentHits.length != 0) {
      // ---------------Extract keys and values
      arrayOfKeys = Object.keys(documentHits[0]._source);

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

      for (let i = 0; i < columnNumber; i++) {
        arrayOfNumbers.push(i);
      }
    }

    res.status(200).render('search', {
      title: 'Search',
      searchAction,
      indicesString,
      documentHits,
      arrayOfKeys,
      arrayOfValues,
      arrayOfNumbers,
    });
  } catch (err) {
    res.status(200).render('error', {
      title: 'Error',
      err,
    });
  }
};
