import React, { Component } from 'react'
import Link from 'gatsby-link'

const NavLink = ({ text, url, nonexist }) => {
  return !nonexist ? <Link to={url}>{text}</Link> : null
}

const IndexPage = ({ pathContext }) => {
  const { group, index, first, last, pageCount, pathPrefix } = pathContext

  const previousUrl = index - 1 == 1 ? '' : `${pathPrefix}/${index - 1}`
  const nextUrl = `${pathPrefix}/${index + 1}`

  return (
    <div>
      <h4>{pageCount} Posts</h4>

      {group.map(({ node }) => (
        <div key={node.id} className="blogListing">
          <div className="date">{node.frontmatter.date}</div>
          <Link className="blogUrl" to={node.frontmatter.path}>
            {node.frontmatter.title}
          </Link>
          <div>{node.frontmatter.excerpt}</div>
        </div>
      ))}
      <NavLink nonexist={first} url={previousUrl} text="Prev" />
      <NavLink nonexist={last} url={nextUrl} text="Next" />
    </div>
  )
}
export default IndexPage
