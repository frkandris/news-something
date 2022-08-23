import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import Feed from '../../../models/Feed'
import moment from 'moment';
const logger = require('pino')();

let Parser = require('rss-parser');
let parser = new Parser();

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        await dbConnect()
        let feedList = await Feed.find({});
        for (let i = 0; i < feedList.length; i++) {
          let feed = await parser.parseURL(feedList[i].feedUrl);
          const insertFeedItems = async () => {
            for (let j = 0; j < feed.items.length; j++) {
              const item = feed.items[j];
              const feedItemExists = await FeedItem.findOne({ link: item.link });
              logger.info(
                {date: moment(item.pubDate).format('YYYY-MM-DD HH:mm'),
                feedTitle: feedList[i].displayTitle,
                title: item.title,
                alreadyInDB: (feedItemExists !== null)
              }); 
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

