import Link from 'next/link'
import dbConnect from '../lib/dbConnect'
import FeedItem from '../models/FeedItem'
import Feed from '../models/Feed'
let moment = require('moment')
const pino = require('pino')
const logger = pino({
  transport: {
    target: 'pino-pretty'
  },
})

const Index = ({ feedList, feedItemListArray }) => (
  <div>
    {feedItemListArray.map((feed, index) => (
      <div key={index}>
        <h3><Link href={feedList[index]._id}>{feedList[index].displayTitle}</Link></h3>
        <ul>
          {feed.map((item, index) => (
            <li key={index}>
              ({moment(item.pubDate).format('HH:mm')}) <Link href={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)

export async function getServerSideProps() {

  await dbConnect()

  let result = await Feed.find({})
  const feedList = result.map((doc) => {
    const feedList = doc.toObject()
    feedList._id = feedList._id.toString()
    return feedList
  })

  let feedItemListArray = [];
  for (let i = 0; i < feedList.length; i++) {
    const result = await FeedItem.find({ feedTitle: feedList[i].title }).sort({ pubDate: -1 }).limit(10);
    const feedItemList = result.map((doc) => {
      const feedItemList = doc.toObject()
      feedItemList._id = feedItemList._id.toString()
      return feedItemList
    })
    feedItemListArray.push(feedItemList)
  }
  return { props: { feedList: feedList, feedItemListArray: feedItemListArray } }
}

export default Index
