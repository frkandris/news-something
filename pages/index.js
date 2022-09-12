import Link from 'next/link'
import { BiCommentDetail } from 'react-icons/bi';
import dbConnect from '../lib/dbConnect'
import FeedItem from '../models/FeedItem'
import Feed from '../models/Feed'
import { DateTime } from 'luxon'

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
                  {item.publishedDate}
                </td>
                <td className="align-text-top">
                  <a href={item.link}>{item.title}</a> ({item.displayTitle}) <a href={`/article/${item.slug}`} title={item.title}><BiCommentDetail /></a>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
      <div className="row">
        {feedItemListArray.map((feed, index) => (
          <div className="col-md-4 p-3 rounded" key={index}>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title m-0">{feedList[index].displayTitle}</h5>
              </div>
              <div className="card-body">
                <table>
                  <tbody>
                    {feed.map((item, index2) => (
                      <tr key={index2}>
                        <td className="px-1 align-text-top font-monospace small">
                          {item.publishedDate}
                        </td>
                        <td className="align-text-top">
                          <a href={item.link}>{item.title}</a> <a href={`/article/${item.slug}`} title={item.title}><BiCommentDetail /></a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-end mt-2">
                  <Link href={`/source/${feedList[index]._id}`}>
                    <a>{`További ${feedList[index].displayTitle} hírek`}</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
)

export async function getStaticProps() {

  await dbConnect()

  const result1 = await Feed.find({}).select('_id displayTitle')
  const feedList = result1.map((doc) => {
    const feedList = doc.toObject()
    feedList._id = feedList._id.toString()
    return feedList
  })

  // get the 12 latest feed items
  const result2 = await FeedItem.find({}).select('_id link title feedId slug publishedDate').sort({ publishedDate: -1 }).limit(12)
  const freshFeedItemList = result2.map((doc) => {
    const freshFeedItemList = doc.toObject()
    freshFeedItemList._id = freshFeedItemList._id.toString()
    freshFeedItemList.feedId = freshFeedItemList.feedId.toString()
    freshFeedItemList.publishedDate = DateTime.fromJSDate(freshFeedItemList.publishedDate).toFormat('T');
    return freshFeedItemList
  })

  // get the feed items for each feed separately
  let feedItemListArray = [];
  for (let i = 0; i < feedList.length; i++) {
    const result = await FeedItem.find({ feedId: result1[i]._id }).select('_id link title feedId slug publishedDate').sort({ publishedDate: -1 }).limit(10);
    const feedItemList = result.map((doc) => {
      const feedItemList = doc.toObject()
      feedItemList._id = feedItemList._id.toString()
      feedItemList.feedId = feedItemList.feedId.toString()
      feedItemList.publishedDate = DateTime.fromJSDate(feedItemList.publishedDate).toFormat('T');
      return feedItemList
    })
    feedItemListArray.push(feedItemList)
  }

  for (let i = 0; i < freshFeedItemList.length; i++) {
    for (let k = 0; k < feedList.length; k++) {
      if (freshFeedItemList[i].feedId === feedList[k]._id) {
        freshFeedItemList[i].displayTitle = feedList[k].displayTitle;
      }
    }
  }

  return {
    props: {
      freshFeedItemList: freshFeedItemList,
      feedList: feedList,
      feedItemListArray: feedItemListArray
    },
    revalidate: 60
  }
}

export default Index
