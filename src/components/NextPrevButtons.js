import React from 'react'
import Link from 'gatsby-link'
import { Button, Icon } from 'antd'

const NextPrevButton = ({ next, prev }) => {
  let nextButton, prevButton
  if (prev) {
    const {
      frontmatter: { path: prevPath, title: prevTitle }
    } = prev
    prevButton = (
      <Button type="primary" style={{ float: 'left' }} size="small">
        <Link to={prevPath}>
          <Icon type="caret-left" /> {prevTitle}
        </Link>
      </Button>
    )
  }
  if (next) {
    const {
      frontmatter: { path: nextPath, title: nextTitle }
    } = next
    nextButton = (
      <Button type="primary" style={{ float: 'right' }} size="small">
        <Link to={nextPath}>
          {nextTitle} <Icon type="caret-right" />
        </Link>
      </Button>
    )
  }
  return (
    <div style={{ marginTop: 50 }}>
      {/* <Button.Group size="small"> */}
      {prevButton}
      {nextButton}
      {/* </Button.Group> */}
    </div>
  )
}

export default NextPrevButton
