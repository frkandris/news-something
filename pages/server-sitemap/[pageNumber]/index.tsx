import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { queryParameter } = ctx.query
  let pageNumber: number = 0
  if (queryParameter) {
    pageNumber = Number(queryParameter.toString().replace('/sitemap.xml', ''))
  }

  await dbConnect()
  const feedItems = await FeedItem.find({}).select('slug').limit(5000).skip(pageNumber * 5000).sort({ publishedDate: -1 })
  const urls = feedItems.map((feedItem) => `https://friss-hirek.com/article/${feedItem.slug}`)

  // create fields array, that has all the fields you want to include in the sitemap
  const fields = urls.map((url) => ({
    loc: url,
    lastmod: new Date().toISOString(),
  }))

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() { }