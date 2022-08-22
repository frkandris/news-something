import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import Feed from '../../../models/Feed'

let Parser = require('rss-parser');
let parser = new Parser();

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        await dbConnect()
        let feedList = await Feed.find({});
        let feedUrlArray = [];
        for (let i = 0; i < feedList.length; i++) {
          feedUrlArray.push(feedList[i].feedUrl);
        }
        for (let i = 0; i < feedUrlArray.length; i++) {          
          let feed = await parser.parseURL(feedUrlArray[i]);
          const insertFeedItems = async () => {
            for (let i = 0; i < feed.items.length; i++) {
              const item = feed.items[i];
              const feedItemExists = await FeedItem.findOne({ link: item.link });
              // console.log("%s - %s", feed.title, item.title);
              if (!feedItemExists) {
                const feedItem = await FeedItem.create({
                  title: item.title,
                  link: item.link,
                  pubDate: item.pubDate,
                  content: item.content,
                  contentSnippet: item.contentSnippet,
                  guid: item.guid,
                  categories: item.categories,
                  isoDate: item.isoDate,
                  feedTitle: feed.title,
                })
              }
            }
          }
          await insertFeedItems();
        }
        res.status(200).json({ success: true })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}

