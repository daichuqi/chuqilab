import React from 'react'
import { Link } from 'gatsby'
import { Icon } from 'antd'

const NextPrevButton = ({ next, prev }) => {
  let nextButton, prevButton

  if (prev) {
    const {
      fields: { slug: prevPath },
      frontmatter: { title: prevTitle },
    } = prev

    prevButton = (
      <Link to={prevPath} style={{ float: 'left' }}>
        <Icon type="caret-left" /> {prevTitle}
      </Link>
    )
  }
  if (next) {
    const {
      fields: { slug: nextPath },
      frontmatter: { title: nextTitle },
    } = next

    nextButton = (
      <Link to={nextPath} style={{ float: 'right' }}>
        {nextTitle} <Icon type="caret-right" />
      </Link>
    )
  }
  return (
    <div style={{ margin: '50px 0 40px', paddingBottom: 1 }}>
      {prevButton}
      {nextButton}
    </div>
  )
}

export default NextPrevButton
