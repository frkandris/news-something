import dbConnect from '../../../lib/dbConnect'
import Feed from '../../../models/Feed'

let Parser = require('rss-parser');
let parser = new Parser();

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            try {
                await dbConnect()
                let feedList = [
                    'https://www.origo.hu/contentpartner/rss/origoall/origo.xml',
                    'https://telex.hu/rss/feed.rss',
                    'https://444.hu/feed'
                ];
                for (let i = 0; i < feedList.length; i++) {
                    let item = await parser.parseURL(feedList[i]);
                    const insertFeed = async () => {
                        const feedExists = await Feed.findOne({ feedUrl: item.feedUrl });
                        if (!feedExists) {
                            const result = await Feed.create({
                                feedUrl: item.feedUrl,
                                image: item.image,
                                paginationLinks: item.paginationLinks,
                                title: item.title,
                                description: item.description,
                                link: item.link,
                                language: item.language,
                                copyright: item.copyright,
                            })
                        }
                    }
                    await insertFeed();
                }
                res.status(200).json({ success: true })
                break
            }
            catch (error) {
                res.status(400).json({ success: false })
                break
            }
        default:
            res.status(400).json({ success: false })
            break
    }
}

