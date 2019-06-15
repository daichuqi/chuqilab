import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from '../components/layout'
import BlogItem from '../components/BlogItem'
import '../styles/blog-list.scss'

const NavLink = ({ text, url, show }) =>
  show ? <Link to={url}>{text}</Link> : null

export default class BlogList extends Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        <div className="template-wrapper blog-pages">
          {posts.map(({ node }) => (
            <BlogItem key={node.id} node={node} />
          ))}

          <NavLink show={!isFirst} url={prevPage} text="Prev" />
          <NavLink show={!isLast} url={nextPage} text="Next" />
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
