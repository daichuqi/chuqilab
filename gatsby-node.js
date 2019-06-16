const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const createPaginatedPages = require('gatsby-paginate')

const blogListTemplate = './src/templates/blog-list.js'
const blogPostTemplate = './src/templates/blog-post.js'
const home = './src/templates/home.js'

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    // const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    date
                    image
                    imageMin
                    excerpt
                    imagePosition
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        createPage({ path: '/', component: path.resolve(home) })

        const posts = result.data.allMarkdownRemark.edges
        const postsPerPage = 3
        const numPages = Math.ceil(posts.length / postsPerPage)

        // Create blog posts pages.
        _.each(posts, (post, index) => {
          createPage({
            path: post.node.fields.slug,
            component: path.resolve(blogPostTemplate),
            context: {
              slug: post.node.fields.slug,
              prev: index === 0 ? null : posts[index - 1].node,
              next: index === posts.length - 1 ? null : posts[index + 1].node
            }
          })
        })

        _.times(numPages, i => {
          createPage({
            path: i === 0 ? `/page` : `/page/${i + 1}`,
            component: path.resolve(blogListTemplate),
            context: {
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages,
              currentPage: i + 1
            }
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}
