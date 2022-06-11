const client = require('./../connection');

exports.doSearch = async (req, res) => {
  try {
    //---Return an array of indices: use for index dropdown
    const indices = await client.indices.get({
      index: '_all',
    });

    let indicesString = [];

    for (const index in indices) {
      indicesString.push(index);
    }
    indicesString = indicesString.map((el) => el.split('_').join(' '));

    //---Format SORT string
    let sortString = [];
    let sortObj = {};

    let textObj = {};

    if (typeof req.query.sort != 'undefined') {
      textObj = await client.indices.getFieldMapping({
        index: req.params.index,
        fields: req.query.sort.split('-').pop(),
      });
      const stringObj = JSON.stringify(textObj);

      if (stringObj.includes('"type":"text"')) {
        if (req.query.sort.slice(0, 3) == 'asc') {
          sortObj = `{ "${req.query.sort
            .split('-')
            .pop()}.keyword": { "order": "asc" } }`;
        }
        if (req.query.sort.slice(0, 3) == 'dsc') {
          sortObj = `{ "${req.query.sort
            .split('-')
            .pop()}.keyword": { "order": "desc" } }`;
        }
      } else {
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
      }

      sortString.push(JSON.parse(sortObj));
    }

    //---Default LIMIT (if user don't type limit) is 100
    if (!req.query.limit) {
      req.query.limit = 100;
    }

    //---Return a QUERY string
    let queryString = '';
    if (!req.query.query_string) {
      queryString = '';
    } else {
      queryString = req.query.query_string;
    }

    //---Format FIELD string
    let fieldString = ['*'];
    if (req.params.field) {
      fieldString = req.params.field;
    }

    //---SEARCH
    const documents = await client.search({
      index: req.params.index,
      body: {
        // sort: [{ 'episode': { order: 'asc' } }],
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

    //---Format SEARCH ACTION and get the FIELD array: wether there is an index selection or not
    let searchAction = '';
    let documentsForKey = [];
    let arrayOfKeys = [];

    if (!req.params.index) {
      searchAction = '/search/';
    } else {
      //-Get search Action
      searchAction = `/search/${req.params.index}`;
      //-Get array of keys
      documentsForKey = await client.search({
        index: req.params.index,
        body: {
          size: 1,
          query: { match_all: {} },
        },
      });
      arrayOfKeys = Object.keys(documentsForKey.hits.hits[0]._source);
    }

    //---Return document hits
    let documentHits = documents.hits.hits;
    if (queryString == '') documentHits = []; //Bug

    //---Extract keys and values: use for rendering table
    let arrayOfValues = [];
    let arrayOfNumbers = [];

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

      //---Define the number of columns
      const columnNumber = Object.keys(arrayOfValues[0]).length;

      for (let i = 0; i < columnNumber; i++) {
        arrayOfNumbers.push(i);
      }
    }

    //---Return this url: use for SORT function
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
