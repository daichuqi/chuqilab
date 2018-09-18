import React from 'react'
import Helmet from 'react-helmet'
import NextPrevButtons from '../components/NextPrevButtons'
import moment from 'moment-timezone'
import getDateString from '../utils/date-string'
import TagsLabel from '../components/Tags/TagsLabel'
import ProgressiveImage from 'react-progressive-image'

import '../styles/blog-post.scss'

const Template = ({ data, location, pathContext }) => {
  const { markdownRemark: post } = data
  const {
    frontmatter: { title, date, image, imageMin, excerpt, imagePosition, tags },
    html
  } = post
  const { prev, next } = pathContext

  console.log('imageMin', imageMin)

  return (
    <div>
      <div className="background-image-container">
        <ProgressiveImage src={image} placeholder={imageMin || image}>
          {(src, loading) => (
            <img
              className={`progressive-image ${loading ? 'loading' : ''}`}
              style={{ objectPosition: imagePosition }}
              src={src}
            />
          )}
        </ProgressiveImage>
      </div>
      <div className="blog-post-page template-wrapper">
        <Helmet title={`${title} - My Blog`} />
        <div>
          <div className="blog-detail-header">
            <div className="title">{title}</div>
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
