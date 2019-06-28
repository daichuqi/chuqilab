import React from 'react'
import { Link } from 'gatsby'
import { Icon } from 'antd'
import Img from '../../library/cloudimage'

import './style.scss'

const BlogItem = ({
  node: {
    fields: { slug },
    frontmatter: { excerpt, title, date, image, imagePosition },
  },
}) => {
  const content = (
    <>
      <div className="blog-title">{title}</div>
      <div className="blog-date">
        <Icon type="history" style={{ marginRight: 8 }} />
        {date}
      </div>
    </>
  )

  return (
    <Link className="blog-title" to={slug}>
      <div className="blog-item">
        <div className="blog-header">
          {image ? (
            <div className="feature-image-container">
              <Img
                src={image}
                className="feature-image"
                style={{ objectPosition: imagePosition }}
                operation="width"
                size="600"
              />

              <div className="dark-wrapper">{content}</div>
            </div>
          ) : (
            <div className="no-feature-image">{content}</div>
          )}
        </div>
      </div>
    </Link>
  )
}
export default BlogItem
