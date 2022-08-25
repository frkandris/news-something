import Head from 'next/head'
import dbConnect from '../lib/dbConnect'
import FeedItem from '../models/FeedItem'

const AboutPage = ({ articleCount, version }) => {
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
                        <h1 className="mb-3">Rólunk</h1>
                        <ul>
                            <li>{articleCount} cikket indexelünk.</li>
                            <li>v{version}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getStaticProps({ }) {
    await dbConnect()
    const version = require('../package.json').version
    const articleCount = await FeedItem.countDocuments()
    return {
        props: {
            articleCount: articleCount,
            version: version
        },
        revalidate: 60
    }
}

export default AboutPage