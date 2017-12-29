import React from 'react'
import Link from 'gatsby-link'
import './style.scss'

const BlogItem = ({
  node: { frontmatter: { path, excerpt, title, date } },
}) => (
  <div className="blog-item">
    <Link className="blog-title" to={path}>
      {title}
    </Link>
    <span className="blog-date">{date}</span>
    <div className="blog-excerpt">{excerpt}</div>
  </div>
)
export default BlogItem
