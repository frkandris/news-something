import { useRouter } from 'next/router'
import Head from 'next/head'
import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import Link from 'next/link'

const ArticlePage = ({ feedItem }) => {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>
                    {`${feedItem.title} | Friss hírek | friss-hirek.com`}
                </title>
            </Head>
            <div className="container" key={feedItem._id}>
                <div className="row align-items-start m-2">
                    <div className="col border p-3 m-2 rounded bg-light">
                        <h1 className="mb-0">{feedItem.title}</h1>
                        <p className="alas"><Link href={feedItem.link}>{feedItem.link}</Link></p>
                        <p>{feedItem.content}</p>
                        <div className="text-end">
                            <Link href="/">
                                <a>Vissza a főoldalra</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ params }) {
    await dbConnect()

    let feedItem = await FeedItem.findById(params.id).lean()
    feedItem._id = feedItem._id.toString()
    return { props: { feedItem: feedItem } }
}

export default ArticlePage