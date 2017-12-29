import React, { Component } from 'react'
import Link from 'gatsby-link'
import BlogItem from '../components/BlogItem'

const NavLink = ({ text, url, show }) => {
  return show ? <Link to={url}>{text}</Link> : null
}

const sortPost = (a, b) => {
  const prevPost = b.node.frontmatter.date
  const nextPost = a.node.frontmatter.date
  const getTime = postDate => new Date(postDate).getTime()
  return getTime(prevPost) - getTime(nextPost)
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
      {group.map(({ node }) => <BlogItem key={node.id} node={node} />)}
      <NavLink show={showPrev} url={previousUrl} text="Prev" />
      <NavLink show={showNext} url={nextUrl} text="Next" />
    </div>
  )
}
export default IndexPage
