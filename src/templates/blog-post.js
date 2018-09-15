import React, { Fragment } from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import NextPrevButtons from '../components/NextPrevButtons'
import moment from 'moment-timezone'
import getDateString from '../utils/date-string'
import Swipe from 'react-easy-swipe'

import '../styles/blog-post.scss'

const Template = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data
  const {
    frontmatter: { title, date, image, excerpt, imagePosition },
    html
  } = post
  const { prev, next } = pathContext

  let nav = false
  const onSwipeEnd = data => {
    if (nav === 'next' && next) {
      window.location = `${next.frontmatter.path}`
    } else if (nav === 'prev' && prev) {
      window.location = `${prev.frontmatter.path}`
    }
  }

  const onSwipeMove = ({ x }) => {
    if (x > 200) {
      nav = 'next'
    } else if (x < -200) {
      nav = 'prev'
    } else {
      nav = false
    }
  }

  return (
    <div>
      <div className="background-image-container">
        <img src={image} style={{ objectPosition: imagePosition }} />
      </div>
      <div className="blog-post-page template-wrapper">
        <Swipe onSwipeEnd={onSwipeEnd} onSwipeMove={onSwipeMove}>
          <Helmet title={`${title} - My Blog`} />
          <div>
            <div className="blog-detail-header">
              <div className="title">{title}</div>
              <div className="date">{getDateString(date)}</div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <NextPrevButtons prev={prev} next={next} />
          </div>
        </Swipe>
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
