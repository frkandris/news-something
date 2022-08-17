import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'

let Parser = require('rss-parser');
let parser = new Parser();

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const feed = await parser.parseURL('https://www.origo.hu/contentpartner/rss/origoall/origo.xml');
        const options = { ordered: true };
        const result = await FeedItem.insertMany(feed.items, options);
        console.log(result);
        res.status(200).json({ success: true, data: feed })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
