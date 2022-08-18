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

        // an async function that inserts the feed items into database
        const insertFeedItems = async () => {

          for (let i = 0; i < feed.items.length; i++) {
            const item = feed.items[i];

            // check if the feed item already exists in the database
            const feedItemExists = await FeedItem.findOne({ guid: item.guid });
            if (feedItemExists) {
              return;
            }
            // if the feed item does not exist, insert it into the database
            const feedItem = await FeedItem.create({
              title: feed.items[0].title,
              link: feed.items[0].link,
              pubDate: feed.items[0].pubDate,
              content: feed.items[0].content,
              contentSnippet: feed.items[0].contentSnippet,
              guid: feed.items[0].guid,
              categories: feed.items[0].categories,
              isoDate: feed.items[0].isoDate,
            })
          }
        }
        await insertFeedItems();

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

