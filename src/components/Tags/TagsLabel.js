import React from 'react'
import { Tag } from 'antd'

const TagsLabel = props => {
  if (props.tags && props.tags.length > 0) {
    return (
      <div style={props.style}>
        <span style={{ marginRight: 5 }}>Tags: </span>
        {props.tags.map(tag => (
          <Tag key={tag} color="magenta">
            {tag}
          </Tag>
        ))}
      </div>
    )
  }
  return <div />
}

export default TagsLabel
