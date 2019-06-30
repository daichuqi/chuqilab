import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Columns from 'react-columns'
import Layout from '../components/Layout'
import BlogItem from '../components/BlogItem'

import { queries } from './configs'

const NavLink = ({ text, pageCount, show, style }) =>
  show && (
    <Link style={style} to={`/page/${pageCount}`}>
      {text}
    </Link>
  )

export default class BlogList extends Component {
  render() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()

    return (
      <Layout location={this.props.location}>
        <Helmet title={`Page ${currentPage} | Blog`} />
        <div className="template-wrapper blog-pages">
          <Columns queries={queries}>
            {posts.map(({ node }) => (
              <BlogItem key={node.id} node={node} />
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
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMM DD YYYY")
            title
            excerpt
            image
            imageMin
            imagePosition
            tags
            type
          }
        }
      }
    }
  }
`
