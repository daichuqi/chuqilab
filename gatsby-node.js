const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

const blogListTemplate = './src/templates/blog-list.js'
const blogPostTemplate = './src/templates/blog-post.js'
const blogPost = path.resolve('./src/templates/blog-post.js')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost {
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
        console.log('posts', posts)
        posts.forEach((post, index) => {
          createPage({
            path: `/blog/${post.node.slug}/`,
            component: blogPost,
            context: {
              slug: post.node.slug,
            },
          })
        })

        const postsPerPage = 10
        const numPages = Math.ceil(posts.length / postsPerPage)

        _.times(numPages, i => {
          createPage({
            path: i === 0 ? `/page` : `/page/${i + 1}`,
            component: path.resolve(blogListTemplate),
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
