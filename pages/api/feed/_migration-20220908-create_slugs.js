import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
const slugify = require('slugify')

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            try {
                await dbConnect()
                let feedItemList = await FeedItem.find({ slug: { $regex: /[^a-zA-Z0-9-]/ } })
                for (let i = 0; i < feedItemList.length; i++) {
                    let slugString = feedItemList[i].title;
                    let slug = slugify(slugString, { replacement: '-', remove: /[^a-zA-Z0-9-]/g, lower: true, locale: 'hu' });
                    console.log(i, slug);
                    await FeedItem.updateOne({ _id: feedItemList[i]._id }, { slug: slug })
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
