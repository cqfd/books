var cheerio = require('cheerio');
var request = require('request');

module.exports.searchStrand = function(searchString, cb) {
  request.get({
      uri: "https://www.strandbooks.com/index.cfm?fuseaction=search.results", 
      qs: {hasInventory: true, 
           searchString: searchString}
    },
    function(err, resp, body) {
      if (err) {
        return cb(err, null);
      }

      var $ = cheerio.load(body);
      var results = [];
      $('.product').each(function() {
        results.push({
          img: $('.image img', this).attr('src'),
          price: $('.price span', this).text().trim(),
          title: $('.info h3 a', this).text().trim(),
          description: $('.desc-brief').text().trim()
        });
      });
      return cb(null, results);
    }
  );
};

module.exports.searchMcNallyJackson = function(searchString, cb) {
  var endpoint = "http://www.mcnallyjackson.com/search/apachesolr_search/";
  endpoint += encodeURIComponent(searchString);
  request.get(endpoint, function(err, resp, body) {
    if (err) {
      return cb(err, null);
    }

    var $ = cheerio.load(body);
    var results = [];
    var row = 0;
    $('.search-results tr').each(function() {
      if (row % 2 == 0) {
        var link = $('.abaproduct-title a', this);
        var isbn = link.attr('href').match(/\d{13}/)[0];
        var title = link.text().trim();
        results.push({
          isbn: isbn,
          title: title,
          price: $('.abaproduct-price', this).text().trim()
        });
      }
      row += 1;
    });
    return cb(null, results);
  });
};
