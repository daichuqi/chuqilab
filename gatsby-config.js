var proxy = require('http-proxy-middleware')

let contentfulConfig

try {
  // Load the Contentful config from the .contentful.json
  contentfulConfig = require('./.contentful')
  console.log('contentfulConfig', contentfulConfig)
} catch (_) {}

// Overwrite the Contentful config with environment variables if they exist
contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID || contentfulConfig.spaceId,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || contentfulConfig.accessToken,
}

const { spaceId, accessToken } = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error('Contentful spaceId and the delivery token need to be provided.')
}

module.exports = {
  developMiddleware: app => {
    app.use(
      '/.netlify/functions/',
      proxy({
        target: 'http://localhost:9000',
        secure: false, // Do not reject self-signed certificates.
        pathRewrite: {
          '/.netlify/functions/': '',
        },
      })
    )
  },
  siteMetadata: {
    title: 'CQ',
    author: 'Richie',
    description: 'hi',
    siteUrl: 'http://chuqilab.herokuapp.com/',
  },
  pathPrefix: '/gatsby-starter-blog',
  plugins: [
    {
      resolve: 'gatsby-source-pg',
      options: {
        rejectUnauthorized: false,
        connectionString:
          'postgres://daichuqi:123456789@chuqilab.c2ls2eak4iwb.us-west-2.rds.amazonaws.com:5432/mydb?ssl=1',
        schema: 'public',
        refetchInterval: 300, // Refetch data every 60 seconds
      },
    },
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets`,
        name: 'assets',
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-125866345-1',
        head: false,
        anonymize: true,
        respectDNT: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/favicon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
  ],
}
