import Link from 'next/link'
import { BiCommentDetail } from 'react-icons/bi';
import dbConnect from '../../../lib/dbConnect'
import Feed from '../../../models/Feed'
import FeedItem from '../../../models/FeedItem'
let moment = require('moment')

const FeedPage = ({ feedData, feedItemList }) => {
    return (
        <div className="container" key={feedData._id}>
            <div className="row align-items-start m-2">
                <div className="col border p-3 m-2 rounded bg-light">
                    <h5>{feedData.displayTitle}</h5>
                    <table className="table table-hover">
                        <tbody>
                            {feedItemList.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-1 align-text-top font-monospace small">
                                        {moment(item.pubDate).format('HH:mm')}
                                    </td>
                                    <td className="align-text-top">
                                        <Link href={item.link}>{item.title}</Link> <Link href={`/article/${item._id}`}><a><BiCommentDetail /></a></Link><br />
                                        {item.content}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <Link href="/">
                            <a>Vissza a főoldalra</a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    await dbConnect()
    const feedList = await Feed.find({})
    const paths = feedList.map(feed => ({
        params: {
            id: feed._id.toString()
        }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}

export async function getStaticProps({ params }) {
    await dbConnect()

    const feedList = await Feed.find({ _id: params.id })
    const result = await FeedItem.find({ feedId: feedList[0]._id }).sort({ isoDate: -1 });

    const feedData = feedList[0].toObject();
    feedData._id = feedData._id.toString()
    feedData.lastUpdated = feedData.lastUpdated.toString()

    const feedItemList = result.map((doc) => {
        const feedItemList = doc.toObject()
        feedItemList._id = feedItemList._id.toString()
        feedItemList.feedId = feedItemList.feedId.toString()
        return feedItemList
    })


    return {
        props: {
            feedData: feedData,
            feedItemList: feedItemList
        },
        revalidate: 60
    }
}

export default FeedPage