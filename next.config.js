// next.config.js

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    // time in seconds of no pages generating during static
    // generation before timing out
    staticPageGenerationTimeout: 1000,

    assetPrefix: isProd ? '/news-something/' : '',
    images: {
        unoptimized: true,
    },
}