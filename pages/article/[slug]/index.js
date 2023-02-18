import Head from 'next/head'
import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import Link from 'next/link'

const ArticlePage = ({ feedItem }) => {

    if (feedItem === null) {
        return (
            <>
                <Head>
                    <title>
                        {`Üres oldal | Friss hírek | friss-hirek.com`}
                    </title>
                </Head>
            </>
        )
    } else {
        return (
            <>
                <Head>
                    <title>
                        {`${feedItem?.title} | Friss hírek | friss-hirek.com`}
                    </title>
                </Head>
                <div className="container" key={feedItem?._id}>
                    <div className="row align-items-start m-2">
                        <div className="col border p-3 m-2 rounded bg-light">
                            <h1 className="mb-0">{feedItem?.title}</h1>
                            <p className="alas"><a href={feedItem?.link}>{feedItem?.link}</a></p>
                            <p dangerouslySetInnerHTML={{ __html: feedItem?.content }} />
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
}

export async function getStaticPaths() {
    await dbConnect()
    // const feedItemList = await FeedItem.find().skip(128335).limit(5)
    const feedItemList = await FeedItem.find({ slug: { $regex: /^[a-zA-Z0-9\-]+$/ } })
    const paths = feedItemList.map(feedItem => ({
        params: {
            slug: feedItem.slug || ''
        }
    }))
    return {
        paths,
        fallback: true
    }
}

// export async function getServerSideProps({ params }) {
export async function getStaticProps({ params }) {
    await dbConnect()
    const feedItem = await FeedItem.findOne({ slug: params.slug }).select('_id title link content').lean();
    if (feedItem) {
        feedItem._id = feedItem._id.toString()
        return {
            props: {
                feedItem: feedItem
            },
            revalidate: 60
        }
    } else {
        return {
            props: {
                feedItem: null
            }
        }
    }
}

export default ArticlePage