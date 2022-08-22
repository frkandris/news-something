import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'

let Parser = require('rss-parser');
let parser = new Parser();

export default async function handler(req, res) {
  const { method } = req


  switch (method) {
    case 'GET':
      try {
        await dbConnect()
        let feedList = [
          'https://www.origo.hu/contentpartner/rss/origoall/origo.xml',
          'https://telex.hu/rss/feed.rss',
          'https://444.hu/feed'
        ];
        for (let i = 0; i < feedList.length; i++) {
          let feed = await parser.parseURL(feedList[i]);
          const insertFeedItems = async () => {
            for (let i = 0; i < feed.items.length; i++) {
              const item = feed.items[i];
              // console.log(item.title, feed.title);
              const feedItemExists = await FeedItem.findOne({ guid: item.guid });
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

