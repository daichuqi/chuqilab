const lost = require(`lost`)

module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-'
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`
      }
    },
    {
      resolve: `gatsby-plugin-postcss-sass`,
      options: {
        postCssPlugins: [lost()]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src`
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Chuqi`,
        short_name: `Chuqi`,
        start_url: `/`,
        background_color: `#f7f7f7`,
        theme_color: `#191919`,
        display: 'fullscreen',
        icons: [
          {
            src: `/icons/logo-256.png`,
            sizes: `256x256`,
            type: `image/png`
          },
          {
            src: `/icons/logo-128.png`,
            sizes: `128x128`,
            type: `image/png`
          },
          {
            src: `/icons/logo-64.png`,
            sizes: `64x64`,
            type: `image/png`
          }
        ]
      }
    }
  ]
}
