import React, { Component } from 'react'
import Link from 'gatsby-link'

import BlogItem from '../components/BlogItem'
import '../styles/blog-pages.scss'

const NavLink = ({ text, url, show }) => {
  return show ? <Link to={url}>{text}</Link> : null
}

const IndexPage = ({
  pathContext: { group, index, pageCount, pathPrefix }
}) => {
  const showPrev = index !== 1
  const showNext = index !== pageCount
  const previousUrl = index === 2 ? '' : `${pathPrefix}/${index - 1}`
  const nextUrl = `${pathPrefix}/${index + 1}`

  return (
    <div className="blog-pages template-wrapper">
      {group.map(({ node }) => (
        <BlogItem key={node.id} node={node} />
      ))}
      <NavLink show={showPrev} url={previousUrl} text="Prev" />
      <NavLink show={showNext} url={nextUrl} text="Next" />
    </div>
  )
}
export default IndexPage
