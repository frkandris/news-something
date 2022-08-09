var express = require('express');
var router = express.Router();

let Parser = require('rss-parser');
let parser = new Parser();

(async () => {

  let feed = await parser.parseURL('https://www.origo.hu/contentpartner/rss/origoall/origo.xml');
  console.log(feed);

  feed.items.forEach(item => {
    // console.log(item)
  });

})();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
