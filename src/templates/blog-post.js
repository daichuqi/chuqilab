import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import NextPrevButtons from '../components/NextPrevButtons'
import '../styles/blog-post.scss'
import moment from 'moment-timezone'
import getDateString from '../utils/date-string'

const Template = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data
  const { frontmatter: { title, date }, html } = post
  const { prev, next } = pathContext
  const d = getDateString(date)
  return (
    <div>
      <Helmet title={`${title} - My Blog`} />
      <div>
        <div className="blog-detail-header">
          <div className="title">{title}</div>
          <div className="date">{d}</div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <NextPrevButtons prev={prev} next={next} />
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
      }
    }
  }
`
export default Template
