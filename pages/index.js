import Link from 'next/link'
import { BiCommentDetail } from 'react-icons/bi';
import dbConnect from '../lib/dbConnect'
import FeedItem from '../models/FeedItem'
import Feed from '../models/Feed'
let moment = require('moment')

const Index = ({ freshFeedItemList, feedList, feedItemListArray }) => (
  <>
    <div className="container">
      <div className="d-flex align-content-around flex-wrap">
        <div className="border p-3 mb-3 bg-light rounded w-100">
          <h5>Friss hírek</h5>
          <table>
            {freshFeedItemList.map((item, index) => (
              <tr key={index}>
                <td className="px-1 align-text-top font-monospace small">
                  {moment(item.pubDate).format('HH:mm')}
                </td>
                <td className="align-text-top">
                  <Link href={item.link}>{item.title}</Link> ({item.displayTitle}) <Link href={`/article/${item._id}`}><a><BiCommentDetail /></a></Link>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
      <div className="d-flex align-content-around flex-wrap">
        {feedItemListArray.map((feed, index) => (
          <div className="border p-3 bg-light rounded w-25" key={index}>
            <h5>{feedList[index].displayTitle}</h5>
            <ul className="list-unstyled">
              {feed.map((item, index) => (
                <li key={index}>
                  <Link href={item.link}>{item.title}</Link> <Link href={`/article/${item._id}`}><a><BiCommentDetail /></a></Link>
                </li>
              ))}
            </ul>
            <div className="text-end">
              <Link href={`/source/${feedList[index]._id}`}>
                <a>További {feedList[index].displayTitle} hírek</a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
)

export async function getServerSideProps() {

  await dbConnect()

  let result = await Feed.find({})
  const feedList = result.map((doc) => {
    const feedList = doc.toObject()
    feedList._id = feedList._id.toString()
    return feedList
  })

  // get 10 latest feed items
  result = await FeedItem.find({}).sort({ isoDate: -1 }).limit(12)
  const freshFeedItemList = result.map((doc) => {
    const freshFeedItemList = doc.toObject()
    freshFeedItemList._id = freshFeedItemList._id.toString()
    return freshFeedItemList
  })

  // get the feed items for each feed separately
  let feedItemListArray = [];
  for (let i = 0; i < feedList.length; i++) {
    const result = await FeedItem.find({ feedTitle: feedList[i].title }).sort({ isoDate: -1 }).limit(10);
    const feedItemList = result.map((doc) => {
      const feedItemList = doc.toObject()
      feedItemList._id = feedItemList._id.toString()
      return feedItemList
    })
    feedItemListArray.push(feedItemList)
  }

  for (let i = 0; i < freshFeedItemList.length; i++) {
    for (let k = 0; k < feedList.length; k++) {
      if (freshFeedItemList[i].feedTitle === feedList[k].title) {
        freshFeedItemList[i].displayTitle = feedList[k].displayTitle;
      }
    }
  }

  return { props: { freshFeedItemList: freshFeedItemList, feedList: feedList, feedItemListArray: feedItemListArray } }
}

export default Index
