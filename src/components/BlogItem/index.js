import React from 'react'
import { Link } from 'gatsby'
import { Icon, Carousel } from 'antd'
import Img from '../../library/cloudimage'

import './style.scss'

const BlogItem = ({
  node: {
    fields: { slug },
    frontmatter: {
      excerpt,
      title,
      date,
      image,
      images,
      imagePosition,
      type,
      location,
    },
  },
}) => {
  const content = (
    <>
      <div className="blog-title">{title}</div>
      <div className="blog-date">
        <Icon type="history" style={{ marginRight: 6 }} />
        {date}
      </div>
      {location && (
        <div className="blog-location">
          <Icon type="compass" style={{ marginRight: 6 }} />
          {location}
        </div>
      )}
    </>
  )

  return type !== 'image' ? (
    <Link className="blog-title" to={slug}>
      <div className="blog-item">
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
      </div>
    </Link>
  ) : (
    <div className="blog-item">
      <div className="feature-image-container">
        <Carousel autoplay effect="fade" dotPosition="top">
          <Img
            src={images[0]}
            className="feature-image"
            operation="width"
            size="600"
          />
          <Img
            src={images[1]}
            className="feature-image"
            operation="width"
            size="600"
          />
        </Carousel>

        <div className="dark-wrapper">{content}</div>
      </div>
    </div>
  )
}
export default BlogItem
