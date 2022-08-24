import mongoose from 'mongoose'

/* FeedItemSchema will correspond to a collection in your MongoDB database. */
const FeedItemSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  link: {
    type: String,
  },
  pubDate: {
    type: String,
  },
  content: {
    type: String,
  },
  contentSnippet: {
    type: String,
  },
  guid: {
    type: String,
  },
  categories: {
    type: Array,
  },
  isoDate: {
    type: String,
  },
  feedTitle: {
    type: String,
  },
  feedId: {
    type: Object,
  },
})

export default mongoose.models.FeedItem || mongoose.model('FeedItem', FeedItemSchema)
