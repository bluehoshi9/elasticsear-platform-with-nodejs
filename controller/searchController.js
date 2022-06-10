const client = require('./../connection');

exports.doSearch = async (req, res) => {
  try {
    //Index: Use for indices dropdown, return an array of indices
    const indices = await client.indices.get({
      index: '_all',
    });

    let indicesString = [];

    for (const index in indices) {
      indicesString.push(index);
    }
    indicesString = indicesString.map((el) => el.split('_').join(' '));

    //-----Search: Perform search, return an array of objects hit
    //---Format SORT string
    let sortString = [];
    let sortObj = {};
    if (typeof req.query.sort != 'undefined') {
      if (req.query.sort.slice(0, 3) == 'asc') {
        sortObj = `{ "${req.query.sort
          .split('-')
          .pop()}": { "order": "asc" } }`;
      }
      if (req.query.sort.slice(0, 3) == 'dsc') {
        sortObj = `{ "${req.query.sort
          .split('-')
          .pop()}": { "order": "desc" } }`;
      }
      sortString.push(JSON.parse(sortObj));
    }

    if (!req.query.limit) {
      req.query.limit = 100;
    }
    let queryString = '';
    if (!req.query.query_string) {
      queryString = '';
    } else {
      queryString = req.query.query_string;
    }

    let fieldString = ['*'];
    if (req.params.field) {
      fieldString = req.params.field;
    }

    const documents = await client.search({
      index: req.params.index,
      body: {
        sort: sortString,
        size: req.query.limit,
        query: {
          multi_match: {
            query: queryString,
            fields: fieldString,
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

    //Extract keys and values
    if (documentHits.length != 0) {
      arrayOfKeys = Object.keys(documentHits[0]._source);

      for (const document of documentHits) {
        delete document._score;
        delete document.sort;
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
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (fullUrl.indexOf('sort') > 1) {
      fullUrl = fullUrl.slice(0, fullUrl.indexOf('sort') - 1);
    }

    res.status(200).render('search', {
      title: 'Search',
      searchAction,
      indicesString,
      documentHits,
      arrayOfKeys,
      arrayOfValues,
      arrayOfNumbers,
      index: req.params.index,
      limit: req.query.limit,
      queryString,
      fullUrl,
    });
  } catch (err) {
    res.status(200).render('error', {
      title: 'Error',
      err,
    });
  }
};
