import Link from 'next/link'
import dbConnect from '../lib/dbConnect'
import FeedItem from '../models/FeedItem'
let moment = require('moment')
let Parser = require('rss-parser');
let parser = new Parser();

const Index = ({ feedArray }) => (

  <div>
    {feedArray.map((feed, index) => (
      <div key={index}>
        <h3>{feed[0].feedTitle}</h3>
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

  let feedList = [
    'ORIGO',
    'Telex RSS: '
  ];

  let feedArray = [];
  for (let i = 0; i < feedList.length; i++) {
    // find the last 10 feed items for each feed
    const result = await FeedItem.find({ feedTitle: feedList[i] }).sort({ pubDate: -1 }).limit(10);
    const feed = result.map((doc) => {
      const feed = doc.toObject()
      feed._id = feed._id.toString()
      return feed
    })
    feedArray.push(feed)
  }
  return { props: { feedArray: feedArray } }
}

export default Index
