import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import get from 'lodash/get'

import getDateString from '../utils/date-string'
import NextPrevButtons from '../components/NextPrevButtons'
import HeaderImage from '../components/HeaderImage/'
import TagsLabel from '../components/Tags/TagsLabel'
import Layout from '../components/layout'

import '../styles/blog-post.scss'

class BlogPostTemplate extends React.Component {
  render() {
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const { prev, next } = this.props.pageContext
    const {
      frontmatter: {
        title,
        date,
        image,
        imageMin,
        excerpt,
        imagePosition,
        tags
      },
      html
    } = this.props.data.markdownRemark

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: excerpt }]}
          title={`${siteTitle} | ${title} `}
        />
        <div>
          <HeaderImage
            imagePosition={imagePosition}
            image={image}
            imageMin={imageMin}
          />
          <div className="blog-post-page template-wrapper">
            <Helmet title={`${title} - My Blog`} />
            <div>
              <div className="blog-detail-header">
                <div className="title">{title}</div>
                <div className="date">{getDateString(date)}</div>
              </div>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <TagsLabel tags={tags} style={{ marginTop: 30 }} />
              <NextPrevButtons prev={prev} next={next} />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        image
        imageMin
        excerpt
        imagePosition
        tags
      }
    }
  }
`
