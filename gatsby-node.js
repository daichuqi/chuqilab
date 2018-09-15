const path = require('path')
const createPaginatedPages = require('gatsby-paginate')

exports.createPages = ({ boundActionCreators: { createPage }, graphql }) => {
  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
  const pageTemplate = 'src/templates/page.js'

  return graphql(`
    {
      allMarkdownRemark {
        totalCount
        edges {
          node {
            id
            html
            frontmatter {
              date
              path
              title
              excerpt
              tags
              image
              imagePosition
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const sortPost = (a, b) => {
      const prevPost = b.node.frontmatter.date
      const nextPost = a.node.frontmatter.date
      const getTime = postDate => new Date(postDate).getTime()
      return getTime(prevPost) - getTime(nextPost)
    }

    createPaginatedPages({
      edges: result.data.allMarkdownRemark.edges.sort(sortPost),
      createPage,
      pageTemplate,
      pageLength: 10,
      pathPrefix: ''
    })

    const posts = result.data.allMarkdownRemark.edges
    posts.forEach(({ node }, index) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {
          prev: index === 0 ? null : posts[index - 1].node,
          next: index === posts.length - 1 ? null : posts[index + 1].node
        }
      })
    })
  })
}
