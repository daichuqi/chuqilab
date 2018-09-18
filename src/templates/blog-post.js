import React from 'react'
import Helmet from 'react-helmet'
import { Divider } from 'antd'
import moment from 'moment-timezone'

import getDateString from '../utils/date-string'
import NextPrevButtons from '../components/NextPrevButtons'
import HeaderImage from '../components/HeaderImage/'
import TagsLabel from '../components/Tags/TagsLabel'

import '../styles/blog-post.scss'

const Template = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data
  const {
    frontmatter: { title, date, image, imageMin, excerpt, imagePosition, tags },
    html
  } = post
  const { prev, next } = pathContext

  return (
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
            <Divider orientation="left" className="title">
              {title}
            </Divider>
            <div className="date">{getDateString(date)}</div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <TagsLabel tags={tags} style={{ marginTop: 30 }} />
          <NextPrevButtons prev={prev} next={next} />
        </div>
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        date
        path
        tags
        excerpt
        image
        imageMin
        imagePosition
      }
    }
  }
`
export default Template
