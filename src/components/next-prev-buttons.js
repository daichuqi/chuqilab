import React from 'react'
import Link from 'gatsby-link'

const NextPrevButton = ({ next, prev }) => {
  let nextButton, prevButton
  if (next) {
    const { frontmatter: { path: nextPath, title: nextTitle } } = next
    nextButton = <Link to={nextPath}>Next Post: {nextTitle}</Link>
  }
  if (prev) {
    const { frontmatter: { path: prevPath, title: prevTitle } } = prev
    prevButton = <Link to={prevPath}>Prev Post: {prevTitle}</Link>
  }
  return (
    <div>
      <div>{prevButton}</div>
      <div>{nextButton}</div>
    </div>
  )
}

export default NextPrevButton
