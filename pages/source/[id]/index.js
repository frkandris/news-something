import Link from 'next/link'
import { BiCommentDetail } from 'react-icons/bi';
import dbConnect from '../../../lib/dbConnect'
import Feed from '../../../models/Feed'
import FeedItem from '../../../models/FeedItem'
import { DateTime } from 'luxon'

const SingleFeedPage = ({ feedData, feedItemList }) => {
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
                                        {item.publishedDate}
                                    </td>
                                    <td className="align-text-top">
                                        <a href={item.link}>{item.title}</a> <a href={`/article/${item.slug}`}><BiCommentDetail /></a><br />
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

    const feedList = await Feed.find({ _id: params.id }).select('_id displayTitle')
    const result = await FeedItem.find({ feedId: feedList[0]._id }).select('_id publishedDate link title slug').sort({ publishedDate: -1 });

    const feedData = feedList[0].toObject();
    feedData._id = feedData._id.toString()

    const feedItemList = result.map((doc) => {
        const feedItemList = doc.toObject()
        feedItemList._id = feedItemList._id.toString()
        feedItemList.publishedDate = DateTime.fromJSDate(feedItemList.publishedDate).toFormat('T');
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

export default SingleFeedPage