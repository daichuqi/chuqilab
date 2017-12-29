import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import NextPrevButtons from '../components/next-prev-buttons'
import '../styles/blog-post.scss'

const Template = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data
  const { frontmatter: { title, date }, html } = post
  const { prev, next } = pathContext

  return (
    <div>
      <Helmet title={`${title} - My Blog`} />
      <div>
        <div className="blog-detail-header">
          <div className="title">{title}</div>
          <div className="date">{date}</div>
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
        date(formatString: "MMM DD YYYY")
        path
        tags
        excerpt
      }
    }
  }
`
export default Template
