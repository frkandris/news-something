let Parser = require('rss-parser');
let parser = new Parser();

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const feed = await parser.parseURL('https://www.origo.hu/contentpartner/rss/origoall/origo.xml');
        res.status(200).json({ success: true, data: feed })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
