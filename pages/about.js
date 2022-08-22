import Head from 'next/head'
import dbConnect from '../lib/dbConnect'
import FeedItem from '../models/FeedItem'

const AboutPage = ({ articleCount }) => {
    return (
        <>
            <Head>
                <title>
                    Rólunk | Friss hírek | friss-hirek.com
                </title>
            </Head>
            <div className="container">
                <div className="row align-items-start m-2">
                    <div className="col border p-3 m-2 rounded bg-light">
                        <h1 className="mb-0">Rólunk</h1>
                        <p>{articleCount} cikket indexelünk.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ params }) {
    await dbConnect()

    // count the number of feedItems in the database
    let articleCount = await FeedItem.countDocuments()
    return { props: { articleCount: articleCount } }
}

export default AboutPage