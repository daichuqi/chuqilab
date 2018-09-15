import React from 'react'
import Helmet from 'react-helmet'
import NextPrevButtons from '../components/NextPrevButtons'
import moment from 'moment-timezone'
import getDateString from '../utils/date-string'

import '../styles/blog-post.scss'

const Template = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data
  const {
    frontmatter: { title, date, image, excerpt, imagePosition },
    html
  } = post
  const { prev, next } = pathContext

  return (
    <div>
      <div className="background-image-container">
        <img src={image} style={{ objectPosition: imagePosition }} />
      </div>
      <div className="blog-post-page template-wrapper">
        <Helmet title={`${title} - My Blog`} />
        <div>
          <div className="blog-detail-header">
            <div className="title">{title}</div>
            <div className="date">{getDateString(date)}</div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
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
        imagePosition
      }
    }
  }
`
export default Template
