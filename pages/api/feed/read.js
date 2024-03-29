import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import Feed from '../../../models/Feed'
import { DateTime } from 'luxon'
const logger = require('pino')();
const slugify = require('slugify');

let Parser = require('rss-parser');
let parser = new Parser();

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        await dbConnect()
        // let feedList = await Feed.find({}).sort({ lastUpdated: 1 }).limit(1)
        let feedList = await Feed.find({}).sort({ lastUpdated: 1 })
        for (let i = 0; i < feedList.length; i++) {
          // logger.info(
          //   {
          //     action: "Feed update started",
          //     lastUpdated: feedList[i].lastUpdated,
          //     displayTitle: feedList[i].displayTitle
          //   });
          let feed = await parser.parseURL(feedList[i].feedUrl);
          const insertFeedItems = async () => {
            for (let j = 0; j < feed.items.length; j++) {
              const item = feed.items[j];
              const feedItemExists = await FeedItem.findOne({ title: item.title });
              if (feedItemExists) {
                break
              } else {
                const publishedDate = Date(item.isoDate);
                if (publishedDate.toString() === 'Invalid Date') {
                  publishedDate = new Date();
                }

                try {
                  const feedItem = await FeedItem.create({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    content: item.content,
                    contentSnippet: item.contentSnippet,
                    guid: item.guid,
                    categories: item.categories,
                    isoDate: item.isoDate || DateTime.now().toString(),
                    feedTitle: feedList[i].title,
                    feedId: feedList[i]._id,
                    slug: slugify(item.title, { replacement: '-', remove: /[^a-zA-Z0-9\s]/g, lower: true, locale: 'hu' }),
                    publishedDate: publishedDate
                  })
                } catch (error) {
                  logger.error(
                    {
                      action: "FeedItem create error",
                      error: error
                    });
                }
                logger.info(
                  {
                    action: "FeedItem created",
                    feedTitle: feedList[i].displayTitle,
                    title: item.title,
                  });
              }
            }
          }
          await insertFeedItems();
          // logger.info(
          //   {
          //     action: "Feed update ended",
          //     displayTitle: feedList[i].displayTitle
          //   });
          await Feed.updateOne({ feedUrl: feedList[i].feedUrl }, { lastUpdated: new Date() });
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

