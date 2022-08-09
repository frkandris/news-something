var express = require('express');
var router = express.Router();

let Parser = require('rss-parser');
let parser = new Parser();


/* GET home page. */
router.get('/', function(req, res, next) {
  (async () => {

    let feed = await parser.parseURL('https://www.origo.hu/contentpartner/rss/origoall/origo.xml');
    console.log(feed.title);
  
    feed.items.forEach(item => {
      console.log(item.title)
    });

    res.render('index', { title: feed.title, items: feed.items });

  })();
});

module.exports = router;
