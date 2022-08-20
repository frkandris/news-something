import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        await FeedItem.deleteMany({})
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

