import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import Countdown from '../components/Countdown'
import NextPrevButtons from '../components/NextPrevButtons'
import HeaderImage from '../components/HeaderImage/'
import TagsLabel from '../components/Tags/TagsLabel'
import Layout from '../components/Layout'

import './blog-post.scss'

export default class BlogPostTemplate extends React.Component {
  render() {
    const post = get(this.props, 'data.contentfulBlogPost')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    console.log('post', post)

    return (
      <Layout style={{ background: '#fff' }}>
        <Helmet title={`${post.title} | ${siteTitle}`} />
        <HeaderImage sizes={post.heroImage.sizes} />

        <div className="blog-post-page template-wrapper">
          <div className="blog-detail-header">
            <div className="title">{post.title}</div>
            <div className="date">{post.publishDate}</div>

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: post.body.childMarkdownRemark.html,
              }}
            />
          </div>
          <TagsLabel tags={post.tags} style={{ marginTop: 30 }} />
        </div>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      excerpt
      slug
      tags
      place
      publishDate(formatString: "MMMM Do, YYYY")
      heroImage {
        sizes(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulSizes_withWebp
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
