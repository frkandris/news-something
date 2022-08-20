import Link from 'next/link'
import dbConnect from '../lib/dbConnect'
import FeedItem from '../models/FeedItem'

let Parser = require('rss-parser');
let parser = new Parser();

const Index = ({ feed }) => (
  <ul>
     {feed.map((feedItem) => (
       <li key={feedItem._id}><Link href={feedItem.link}>{feedItem.title}</Link> ({feedItem.feedTitle})</li>
     ))}
  </ul>
)

export async function getServerSideProps() {

  await dbConnect()
  /* find all the data in our database */
  const result = await FeedItem.find({})
  const feed = result.map((doc) => {
     const feed = doc.toObject()
     feed._id = feed._id.toString()
     return feed
   })
  return { props: { feed: feed } }

  // const feed = await parser.parseURL('https://www.origo.hu/contentpartner/rss/origoall/origo.xml');
  // console.log(feed);
  // return { props: { feed: feed } }
}

export default Index
