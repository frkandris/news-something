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
                    ['https://www.origo.hu/contentpartner/rss/origoall/origo.xml', 'Origo'],
                    ['https://telex.hu/rss/feed.rss', 'Telex'],
                    ['https://444.hu/feed', '444.hu'],
                    ['https://index.hu/24ora/rss/', 'Index.hu'],
                    ['https://liner.hu/feed/', 'Liner.hu'],
                    ['https://24.hu/feed/', '24.hu'],
                    ['https://hvg.hu/rss', 'HVG.hu'],
                    ['https://www.portfolio.hu/rss/all.xml', 'Portfolio.hu'],
                    ['https://femina.hu/24ora/rss/', 'Femina.hu'],
                    ['https://infostart.hu/24ora/rss', 'Infostart.hu'],
                    ['https://mandiner.hu/rss/', 'Mandiner.hu'],
                    ['https://nepszava.hu/feed/', 'Nepszava.hu'],
                    ['https://pestisracok.hu/feed/', 'Pestisracok.hu'],
                    ['https://propeller.hu/feed/content-sajat.xml', 'Propeller.hu'],
                    ['https://ripost.hu/publicapi/hu/rss/ripost/articles', 'Ripost.hu'],
                    ['https://www.borsonline.hu/publicapi/hu/rss/bors/articles', 'Borsonline.hu'],
                    ['https://www.life.hu/contentpartner/rss/lifehu/life.xml', 'Life.hu'],
                    ['https://www.napi.hu/feed/mindencikk.xml', 'Napi.hu'],
                    ['https://168.hu/rss', '168.hu'],
                    ['https://888.hu/rss', '888.hu'],
                    ['https://blikkruzs.blikk.hu/static/rss.xml', 'Blikk Rúzs'],
                    ['https://demokrata.hu/feed/', 'Demokrata'],
                    ['https://hang.hu/rss', 'Hang.hu'],
                    ['https://hirklikk.hu/rss', 'HirKlikk'],
                    ['https://magyarnarancs.hu/rss', 'Magyar Narancs'],
                    ['https://metropol.hu/feed/', 'Metropol'],
                    ['https://nlc.hu/feed/', 'NLC'],
                    ['https://rss.rtl.hu/', 'RTL'],
                    ['https://www.blikk.hu/rss', 'Blikk'],
                    ['https://www.klubradio.hu/rss', 'Klub Rádió'],
                    ['https://www.szeretlekmagyarorszag.hu/feed/', 'Szeretlek Magyarország'],
                    ['https://forbes.hu/feed/', 'Forbes']
                ];
                for (let i = 0; i < feedList.length; i++) {
                    let item = await parser.parseURL(feedList[i][0]);
                    const insertFeed = async () => {
                        const feedExists = await Feed.findOne({ title: item.title });
                        if (!feedExists) {
                            const result = await Feed.create({
                                feedUrl: item.feedUrl || feedList[i][0],
                                image: item.image,
                                paginationLinks: item.paginationLinks,
                                title: item.title,
                                description: item.description,
                                link: item.link,
                                language: item.language,
                                copyright: item.copyright,
                                displayTitle: feedList[i][1],
                                lastUpdated: new Date(),
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

