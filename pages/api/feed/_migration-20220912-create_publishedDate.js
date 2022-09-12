import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import { DateTime } from 'luxon'

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            try {
                await dbConnect()

                // feedItems with no isoDate get the current dateTime as isoDate
                let feedItemList = await FeedItem.find({ isoDate: { $exists: false } })
                const newDateString = DateTime.now().toString();
                for (let i = 0; i < feedItemList.length; i++) {
                    if (!feedItemList[i].isoDate) {
                        console.log(i, feedItemList[i].title);
                        await FeedItem.updateOne({ _id: feedItemList[i]._id }, { isoDate: newDateString })
                    }
                }

                // feedItems with get isoDate as publishedDate, if no isoDate is available then the current dateTime is used
                let feedItemList2 = await FeedItem.find({ publishedDate: { $exists: false }})
                for (let i = 0; i < feedItemList2.length; i++) {
                    console.log(i, feedItemList2[i].title);
                    let convertedIsoDate = DateTime.fromISO(feedItemList2[i].isoDate);
                    if (convertedIsoDate.isValid) {
                        await FeedItem.updateOne({ _id: feedItemList2[i]._id }, { publishedDate: new Date(feedItemList2[i].isoDate) })
                    } else {
                        await FeedItem.updateOne({ _id: feedItemList2[i]._id }, { publishedDate: new Date() })
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
