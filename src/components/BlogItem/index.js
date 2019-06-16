import React from 'react'
import { Link } from 'gatsby'
import './style.scss'

const BlogItem = ({
  node: {
    fields: { slug },
    frontmatter: { excerpt, title, date },
  },
}) => (
  <div className="blog-item">
    <div className="blog-header">
      <Link className="blog-title" to={slug}>
        {title}
      </Link>
      <span className="blog-date">{date}</span>
    </div>
    <div className="blog-excerpt">{excerpt}</div>
  </div>
)
export default BlogItem
