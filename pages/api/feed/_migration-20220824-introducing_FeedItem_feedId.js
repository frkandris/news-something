import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import Feed from '../../../models/Feed'

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        await dbConnect()
        let feedList = await Feed.find({})
        let feedItemList = await FeedItem.find({})

        for (let i = 0; i < feedItemList.length; i++) {
            for (let j = 0; j < feedList.length; j++) {
                if (feedItemList[i].feedTitle === feedList[j].title) {
                    console.log(i, feedList[j].displayTitle, feedItemList[i].title);
                    await FeedItem.updateOne({ _id: feedItemList[i]._id }, { feedId: feedList[j]._id })
                }
            }            
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

