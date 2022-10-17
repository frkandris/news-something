// pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemapIndex } from 'next-sitemap'
import dbConnect from '../../lib/dbConnect'
import FeedItem from '../../models/FeedItem'

export const getServerSideProps = async (ctx) => {
    await dbConnect()

    const feedItems = await FeedItem.find({}).select('slug')
    const urls = feedItems.map((feedItem) => `https://friss-hirek.com/article/${feedItem.slug}`)

    return getServerSideSitemapIndex(ctx, urls)
}

// Default export to prevent next.js errors
export default function SitemapIndex() { }