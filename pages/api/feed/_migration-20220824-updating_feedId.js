import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import Feed from '../../../models/Feed'

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            try {
                let feedList = await Feed.find({})
                for (let j = 0; j < feedList.length; j++) {
                    console.log(feedList[j].displayTitle);

                    let feedItemList = await FeedItem.find({ feedTitle: feedList[j].title, feedId: null })
                    for (let i = 0; i < feedItemList.length; i++) {
                        console.log(feedItemList[i].title, feedItemList[i].feedId);
                        await FeedItem.updateOne({ _id: feedItemList[i]._id }, { feedId: feedList[0]._id })
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

