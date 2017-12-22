import React, { Component } from 'react'
import Link from 'gatsby-link'
import './page.scss'

const NavLink = ({ text, url, show }) => {
  return show ? <Link to={url}>{text}</Link> : null
}

const IndexPage = ({
  pathContext: { group, index, pageCount, pathPrefix },
}) => {
  const showPrev = index !== 1
  const showNext = index !== pageCount
  const previousUrl = index === 2 ? '' : `${pathPrefix}/${index - 1}`
  const nextUrl = `${pathPrefix}/${index + 1}`

  return (
    <div>
      {group.map(({ node }) => (
        <div key={node.id} className="blog-item">
          <div className="date">{node.frontmatter.date}</div>
          <Link className="blog-url" to={node.frontmatter.path}>
            {node.frontmatter.title}
          </Link>
          <div>{node.frontmatter.excerpt}</div>
        </div>
      ))}
      <NavLink show={showPrev} url={previousUrl} text="Prev" />
      <NavLink show={showNext} url={nextUrl} text="Next" />
    </div>
  )
}
export default IndexPage
