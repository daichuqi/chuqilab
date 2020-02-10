const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')

const blogListTemplate = path.resolve('./src/templates/blog-list.js')
const blogPostTemplate = path.resolve('./src/templates/blog-post.js')
const loginTemplate = path.resolve('./src/templates/login.js')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost(
              sort: { fields: [publishDate], order: DESC }
            ) {
              edges {
                node {
                  title
                  slug
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allContentfulBlogPost.edges

        createPage({
          path: '/login',
          component: loginTemplate,
          context: {
            imageTitle: 'Iseltwald',
          },
        })

        posts.forEach((post, index) => {
          createPage({
            path: `/blog/${post.node.slug}/`,
            component: blogPostTemplate,
            context: {
              slug: post.node.slug,
              prev: index === 0 ? null : posts[index - 1].node,
              next: index === posts.length - 1 ? null : posts[index + 1].node,
            },
          })
        })

        const postsPerPage = 10
        const numPages = Math.ceil(posts.length / postsPerPage)

        _.times(numPages, i => {
          createPage({
            path: i === 0 ? `/page` : `/page/${i + 1}`,
            component: blogListTemplate,
            context: {
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages,
              currentPage: i + 1,
            },
          })
        })
      })
    )
  })
}
