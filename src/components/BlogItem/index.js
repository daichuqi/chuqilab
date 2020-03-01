import React from 'react'
import { HistoryOutlined, CompassOutlined } from '@ant-design/icons'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import './style.scss'

export default ({ node }) => {
  const { title, slug, publishDate, heroImage, place } = node

  return (
    <Link className="blog-title" to={`/blog/${slug}`}>
      <div className="blog-item">
        <div className="feature-image-container">
          <Img sizes={heroImage.sizes} />

          <div className="dark-wrapper">
            <div className="blog-title">{title}</div>
            <div className="blog-date">
              <HistoryOutlined style={{ marginRight: 6 }} />
              {publishDate}
            </div>

            {place && (
              <div className="blog-location">
                <CompassOutlined style={{ marginRight: 6 }} />
                {place}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
