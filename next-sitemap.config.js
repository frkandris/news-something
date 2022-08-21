/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://friss-hirek.com',
    generateRobotsTxt: true,
    exclude: ['/server-sitemap-index.xml'],
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://friss-hirek.com/server-sitemap-index.xml',
      ],
    },
  }