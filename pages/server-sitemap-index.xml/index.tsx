import { getServerSideSitemapIndex } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import dbConnect from '../../lib/dbConnect'
import FeedItem from '../../models/FeedItem'

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  await dbConnect()
  const feedItemsCount = await FeedItem.countDocuments()
  const numberOfSitemaps = Math.ceil(feedItemsCount / 5000)

  const sitemapUrls = []
  for (let i = 0; i < numberOfSitemaps; i++) {
    sitemapUrls.push(`https://friss-hirek.com/server-sitemap/${i}.xml`)
  }

  return getServerSideSitemapIndex(ctx, sitemapUrls)
}

// Default export to prevent next.js errors
export default function SitemapIndex() { }