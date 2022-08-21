import { useRouter } from 'next/router'
import dbConnect from '../../lib/dbConnect'
import Feed from '../../models/Feed'
import FeedItem from '../../models/FeedItem'
import Link from 'next/link'
let moment = require('moment')

const FeedPage = ({ feedData, feedItemList }) => {
    const router = useRouter()

    return (
        <div key={feedData._id}>
            <h3>{feedData.displayTitle}</h3>
            <ul>
                {feedItemList.map((item, index) => (
                    <li key={index}>
                        ({moment(item.pubDate).format('HH:mm')}) <Link href={item.link}>{item.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export async function getServerSideProps({ params }) {
    await dbConnect()

    const feedData = await Feed.findById(params.id).lean()
    feedData._id = feedData._id.toString()

    const result = await FeedItem.find({ feedTitle: feedData.title }).sort({ pubDate: -1 });
    const feedItemList = result.map((doc) => {
        const feedItemList = doc.toObject()
        feedItemList._id = feedItemList._id.toString()
        return feedItemList
    })
    return { props: { feedData: feedData, feedItemList: feedItemList } }
}

export default FeedPage