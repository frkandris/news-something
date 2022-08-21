import mongoose from 'mongoose'

/* FeedSchema will correspond to a collection in your MongoDB database. */
const FeedSchema = new mongoose.Schema({
    feedUrl: {
        type: String,
    },
    image: {
        type: Array,
    },
    paginationLinks: {
        type: Array,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    link: {
        type: String,
    },
    language: {
        type: String,
    },
    copyright: {
        type: String,
    },
    displayTitle: {
        type: String,
    },
})

export default mongoose.models.Feed || mongoose.model('Feed', FeedSchema)
