import dbConnect from '../../../lib/dbConnect'
import FeedItem from '../../../models/FeedItem'
import { extract } from 'article-parser'
const { Configuration, OpenAIApi } = require("openai");

export default async function handler(req, res) {
    const { method } = req

    switch (method) {
        case 'GET':
            try {

                await dbConnect()

                const feedItem = await FeedItem.aggregate([{ $sample: { size: 1 } }])
                const url = feedItem[0].link;

                const getArticleContent = async () => {
                    const article = await extract(url);
                    article.content = article.content.replace(/(<([^>]+)>)/gi, " ");
                    console.log("article.title: " + article.title);
                    console.log("article.content: " + article.content);

                    const configuration = new Configuration({
                        apiKey: process.env.OPENAI_API_KEY,
                    });
                    const openai = new OpenAIApi(configuration);

                    const prompt = `create at least 10 hashtags in Hungarian about the following article: \n\n title: ${article.title}\n\narticle text: ${article.content}`;

                    const response = await openai.createCompletion({
                        model: "text-davinci-002",
                        prompt: prompt,
                        temperature: 0.7,
                        max_tokens: 979,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0,
                    });
                    console.log(response.data.choices[0].text);
                    const gplText = response.data.choices[0].text;
                    const splittedTagArray = gplText.split("#");
                    const trimedArray = splittedTagArray.map(s => s.trim());
                    const filteredArray = trimedArray.filter(function (q) {
                        return q !== '';
                    });
                    console.log(filteredArray);
                    return true;
                }
                // then return the summary
                const summary = await getArticleContent();
                res.status(200).json({ success: true, data: summary })
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}
