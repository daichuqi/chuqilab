import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import NextPrevButton from '../components/next-prev-button'

const Template = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data
  const { frontmatter, html } = post
  const { title, date } = frontmatter
  const { prev, next } = pathContext

  return (
    <div>
      <Helmet title={`${title} - My Blog`} />
      <div>
        <h1>{title}</h1>
        <h3>{date}</h3>

        <div dangerouslySetInnerHTML={{ __html: html }} />
        <NextPrevButton prev={prev} next={next} />
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
        date(formatString: "MMMM, DD, YYYY")
        path
        tags
        excerpt
      }
    }
  }
`
export default Template
