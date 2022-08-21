// pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemapIndex } from 'next-sitemap'
import dbConnect from '../../lib/dbConnect'
import FeedItem from '../../models/FeedItem'

export const getServerSideProps = async (ctx) => {
    await dbConnect()

    const feedIds = await FeedItem.find({}).select('_id')
    const urls = feedIds.map((feedId) => `https://friss-hirek.com/article/${feedId._id}`)

    return getServerSideSitemapIndex(ctx, urls)
}

// Default export to prevent next.js errors
export default function SitemapIndex() { }