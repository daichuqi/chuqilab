import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Columns from 'react-columns'
import Layout from '../components/Layout'
import BlogItem from '../components/BlogItem'

const queries = [
  {
    columns: 1,
    query: 'min-width: 480px',
  },
  {
    columns: 2,
    query: 'min-width: 756px',
  },
  {
    columns: 3,
    query: 'min-width: 1000px',
  },
]

const NavLink = ({ text, pageCount, show, style }) =>
  show && (
    <Link style={style} to={`/page/${pageCount}`}>
      {text}
    </Link>
  )

export default class BlogList extends Component {
  render() {
    const posts = get(this, 'props.data.allContentfulBlogPost.edges') || []
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()

    console.log('posts', posts)

    return (
      <Layout>
        <Helmet title={`Page ${currentPage} | Chuqi`} />
        <div className="template-wrapper blog-pages">
          <Columns queries={queries}>
            {posts.map(({ node }) => (
              <BlogItem key={node.slug} node={node} />
            ))}
          </Columns>

          <NavLink
            show={!isFirst}
            pageCount={prevPage}
            text="Prev"
            style={{ float: 'left' }}
          />
          <NavLink
            show={!isLast}
            pageCount={nextPage}
            text="Next"
            style={{ float: 'right' }}
          />
        </div>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query HomeQuery($skip: Int!, $limit: Int!) {
    allContentfulBlogPost(
      limit: $limit
      skip: $skip
      sort: { fields: [publishDate], order: DESC }
    ) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "MMMM Do, YYYY")
          tags
          place
          heroImage {
            sizes(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
              ...GatsbyContentfulSizes_withWebp
            }
          }
        }
      }
    }
  }
`

// export const pageQuery = graphql`
//   query HomeQuery($skip: Int!, $limit: Int!) {
//     allContentfulBlogPost(
//       sort: { fields: [publishDate]], order: DESC }
//       limit: $limit
//       skip: $skip
//     ) {
//       edges {
//         node {
//           title
//           slug
//           publishDate(formatString: "MMMM Do, YYYY")
//           tags
//           heroImage {
//             sizes(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
//               ...GatsbyContentfulSizes_withWebp
//             }
//           }
//           description {
//             childMarkdownRemark {
//               html
//             }
//           }
//         }
//       }
//     }
//   }
// `
