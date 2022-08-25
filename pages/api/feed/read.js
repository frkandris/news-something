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
        let feedList = await Feed.find({}).sort({ lastUpdated: 1 }).limit(1)
        for (let i = 0; i < feedList.length; i++) {
          logger.info(
            {
              action: "Feed update started",
              lastUpdated: feedList[i].lastUpdated,
              displayTitle: feedList[i].displayTitle
            });
          let feed = await parser.parseURL(feedList[i].feedUrl);
          const insertFeedItems = async () => {
            for (let j = 0; j < feed.items.length; j++) {
              const item = feed.items[j];
              const feedItemExists = await FeedItem.findOne({ title: item.title });
              if (feedItemExists) {
                break
              } else {
                const feedItem = await FeedItem.create({
                  title: item.title,
                  link: item.link,
                  pubDate: item.pubDate,
                  content: item.content,
                  contentSnippet: item.contentSnippet,
                  guid: item.guid,
                  categories: item.categories,
                  isoDate: item.isoDate,
                  feedTitle: feedList[i].title,
                  feedId: feedList[i]._id
                })
                logger.info(
                  {
                    action: "FeedItem created",
                    date: moment(item.pubDate).format('YYYY-MM-DD HH:mm'),
                    feedTitle: feedList[i].displayTitle,
                    title: item.title,
                  });
              }
            }
          }
          await insertFeedItems();
          logger.info(
            {
              action: "Feed update ended",
              displayTitle: feedList[i].displayTitle
            });
          await Feed.updateOne({ feedUrl: feedList[i].feedUrl }, { lastUpdated: new Date() });
        }
        res.status(200).json({ success: true, feedUrl: feedList[i].feedUrl })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}

