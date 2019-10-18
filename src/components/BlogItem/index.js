import React from 'react'
import { Link } from 'gatsby'
import { Icon } from 'antd'
import Img from 'gatsby-image'

import './style.scss'

const BlogItem = ({ node }) => {
  const { title, slug, publishDate, heroImage, place } = node
  console.log('heroImage', heroImage)
  const content = (
    <>
      <div className="blog-title">{title}</div>
      <div className="blog-date">
        <Icon type="history" style={{ marginRight: 6 }} />
        {publishDate}
      </div>
      {place && (
        <div className="blog-location">
          <Icon type="compass" style={{ marginRight: 6 }} />
          {place}
        </div>
      )}
    </>
  )

  return (
    <Link className="blog-title" to={`/blog/${slug}`}>
      <div className="blog-item">
        <div className="feature-image-container">
          <Img sizes={heroImage.sizes} />

          <div className="dark-wrapper">{content}</div>
        </div>
      </div>
    </Link>
  )
}
export default BlogItem
