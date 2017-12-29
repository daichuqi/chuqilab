import React from 'react'
import Link from 'gatsby-link'
import './style.scss'
import getDateString from '../../utils/date-string'

const BlogItem = ({
  node: { frontmatter: { path, excerpt, title, date } },
}) => (
  <div className="blog-item">
    <div className="blog-header">
      <Link className="blog-title" to={path}>
        {title}
      </Link>
      <span className="blog-date">{getDateString(date, 'MMM DD YYYY')}</span>
    </div>
    <div className="blog-excerpt">{excerpt}</div>
  </div>
)
export default BlogItem
