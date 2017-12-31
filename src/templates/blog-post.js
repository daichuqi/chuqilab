import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import NextPrevButtons from '../components/NextPrevButtons'
import '../styles/blog-post.scss'
import moment from 'moment-timezone'
import getDateString from '../utils/date-string'
import Swipe from 'react-easy-swipe'

const Template = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data
  const { frontmatter: { title, date }, html } = post
  const { prev, next } = pathContext
  const d = getDateString(date)
  let nav = false;
  const onSwipeEnd = data => {
    if (nav === 'next' && next) {
      window.location = `${next.frontmatter.path}`;
    } else if (nav === 'prev' && prev) {
      window.location = `${prev.frontmatter.path}`;
    }
  }
  const onSwipeMove = ({ x }) => {
    if (x > 200) {
      nav = 'next'
    } else if (x < -200) {
      nav = 'prev';
    } else {
      nav = false;
    }
  }
  return (
    <div className="blog-post-page template-wrapper">
      <Swipe
        onSwipeEnd={onSwipeEnd}
        onSwipeMove={onSwipeMove}
      >
        <Helmet title={`${title} - My Blog`} />
        <div>
          <div className="blog-detail-header">
            <div className="title">{title}</div>
            <div className="date">{d}</div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <NextPrevButtons prev={prev} next={next} />
        </div>
      </Swipe>
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
      }
    }
  }
`
export default Template
