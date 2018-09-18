import React from 'react'
import { Tag } from 'antd'

const TagsLabel = props => {
  console.log('props', props)
  if (props.tags.length > 0) {
    return (
      <div style={props.style}>
        Tags:
        {'  '}
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
