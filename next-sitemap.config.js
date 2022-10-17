/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://friss-hirek.com',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: ['/server-sitemap-index.xml'],
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://friss-hirek.com/server-sitemap-index.xml',
      ],
    },
  }