import { useRouter } from 'next/router'
import Link from 'next/link'
import { BiCommentDetail } from 'react-icons/bi';
import dbConnect from '../../../lib/dbConnect'
import Feed from '../../../models/Feed'
import FeedItem from '../../../models/FeedItem'
let moment = require('moment')

const FeedPage = ({ feedData, feedItemList }) => {
    const router = useRouter()
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

export async function getServerSideProps({ params }) {
    await dbConnect()

    const feedData = await Feed.findById(params.id).lean()
    feedData._id = feedData._id.toString()

    const result = await FeedItem.find({ feedTitle: feedData.title }).sort({ isoDate: -1 });
    const feedItemList = result.map((doc) => {
        const feedItemList = doc.toObject()
        feedItemList._id = feedItemList._id.toString()
        return feedItemList
    })
    return { props: { feedData: feedData, feedItemList: feedItemList } }
}

export default FeedPage