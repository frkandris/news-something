var rssFinder = require('rss-finder');


export default async function handler(req, res) {

    var urlList = [
        'https://tv2csoport.hu/',
        'https://www.atv.hu/',
        'https://www.blikk.hu/',
        'https://tenyek.hu/',
        'https://nlc.hu/',
        'https://rtl.hu/',
        'https://metropol.hu/',
        'https://demokrata.hu/',
        'https://888.hu/',
        'https://www.szeretlekmagyarorszag.hu/',
        'https://www.klubradio.hu/',
        'https://alfahir.hu/',
        'https://magyarnarancs.hu/',
        'https://hang.hu/',
        'https://hirklikk.hu/',
        'https://168.hu/',
        'https://blikkruzs.blikk.hu/'
    ];

    for (let i = 0; i < urlList.length; i++) {
        rssFinder(urlList[i]).then(function (res) {
            console.log(res);
        }).catch(function (err) {
            console.log(err);
        });
    }
    res.status(200).json({ success: true })
}

