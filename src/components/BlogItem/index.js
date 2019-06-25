import React from 'react'
import { Link } from 'gatsby'
import { Icon } from 'antd'

import './style.scss'

const BlogItem = ({
  node: {
    fields: { slug },
    frontmatter: {
      excerpt,
      title,
      date,
      image,
      imagePosition,
      featureImageHeight,
    },
  },
}) => {
  const content = (
    <>
      <Link className="blog-title" to={slug}>
        {title}
      </Link>
      <div className="blog-date">
        <Icon type="history" style={{ marginRight: 8 }} />
        {date}
      </div>
    </>
  )

  return (
    <div className="blog-item">
      <div className="blog-header">
        {image ? (
          <div className="feature-image-container">
            <img
              className="feature-image"
              style={{
                objectPosition: imagePosition,
                height: featureImageHeight,
              }}
              src={image}
            />

            <div className="dark-wrapper">{content}</div>
          </div>
        ) : (
          <div className="no-feature-image">{content}</div>
        )}
      </div>
    </div>
  )
}
export default BlogItem
