import React from 'react'
import { Link, graphql, navigate } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Columns from 'react-columns'

import Layout from '../components/Layout'
import BlogItem from '../components/BlogItem'
import { isLoggedIn } from '../utils/auth'

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

const NavLink = ({ text, pageCount, show, style }) => (
  <Link style={style} to={`/page/${pageCount}`} hidden={!show}>
    {text}
  </Link>
)

export default function BlogList(props) {
  const posts = get(props, 'data.allContentfulBlogPost.edges') || []
  const { currentPage, numPages } = props.pageContext
  const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
  const nextPage = (currentPage + 1).toString()

  if (typeof window !== `undefined` && !isLoggedIn()) {
    navigate(`/login`)
    return null
  }

  return (
    <Layout>
      <Helmet title={`Page ${currentPage} | Chuqi`} />
      <div className="template-wrapper blog-pages">
        <Columns queries={queries} rootStyles={{ overflowX: 'visible' }} gap={2}>
          {posts.map(({ node }) => (
            <BlogItem key={node.slug} node={node} />
          ))}
        </Columns>
        <NavLink
          show={currentPage !== 1}
          pageCount={prevPage}
          text="Prev"
          style={{ float: 'left' }}
        />
        <NavLink
          show={currentPage !== numPages}
          pageCount={nextPage}
          text="Next"
          style={{ float: 'right' }}
        />
      </div>
    </Layout>
  )
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
            sizes(maxWidth: 350, maxHeight: 220, resizingBehavior: FILL) {
              ...GatsbyContentfulSizes_withWebp
            }
          }
        }
      }
    }
  }
`
