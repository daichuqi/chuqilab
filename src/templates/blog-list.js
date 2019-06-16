import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from '../components/Layout'
import BlogItem from '../components/BlogItem'
import '../styles/blog-list.scss'

const NavLink = ({ text, pageCount, show, style}) => {
  return show && <Link style={style} to={`/page/${pageCount}`}>{text}</Link>
}

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
          
          {posts.map(({ node }) => <BlogItem key={node.id} node={node} />)}

          <NavLink show={!isFirst} pageCount={prevPage} text="Prev" style={{float: 'left'}} />
          <NavLink show={!isLast} pageCount={nextPage} text="Next" style={{float: 'right'}} />
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
          }
        }
      }
    }
  }
`
