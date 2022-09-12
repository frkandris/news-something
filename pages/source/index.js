import Link from 'next/link'
import dbConnect from '../../lib/dbConnect'
import Feed from '../../models/Feed'

const FeedListPage = ({ feedList }) => {
    return (
        <div className="container" key={feedList._id}>
            <div className="row align-items-start m-2">
                <div className="col border p-3 m-2 rounded bg-light">
                    <h5>Források</h5>
                    <table>
                        <tbody>
                            {feedList.map((item, index) => (
                                <tr key={index}>
                                    <td className="align-text-top">
                                        <Link href={`/source/${item._id}`}>{item.displayTitle}</Link>
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

export async function getStaticProps({ }) {
    await dbConnect()

    const result = await Feed.find({}).select('_id displayTitle').sort({ displayTitle: 1 });
    const feedList = result.map((doc) => {
        const feedList = doc.toObject()
        feedList._id = feedList._id.toString()
        return feedList
    })

    return {
        props: {
            feedList: feedList,
        },
        revalidate: 60
    }
}

export default FeedListPage