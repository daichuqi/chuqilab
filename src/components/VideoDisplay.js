import React, { useEffect } from 'react'
import useTwilioVideo from '../hooks/useTwilioVideo'
import Draggable from 'react-draggable'
import _ from 'lodash'

import './VideoDisplay.scss'

export default function VideoDisplay({ onlineUsers = [] }) {
  const { token, videoRef, activeRoom, startVideo, leaveRoom } = useTwilioVideo()

  useEffect(() => {
    if (!activeRoom && token) {
      startVideo()
      window.addEventListener('beforeunload', leaveRoom)
    }

    return () => {
      window.removeEventListener('beforeunload', leaveRoom)
    }
  }, [token, activeRoom, startVideo, leaveRoom])

  useEffect(() => leaveRoom, [])

  const currentUsers = _.uniqBy(onlineUsers, 'user.username').map(({ user }) => user.username)

  return (
    <div className="chat ant-row" ref={videoRef}>
      <Draggable>
        <div id="local-video-wrapper" className="local-video-wrapper"></div>
      </Draggable>

      {currentUsers.map(username => (
        <Draggable key={username}>
          <div id={username} className="remote-participant-wrapper"></div>
        </Draggable>
      ))}
    </div>
  )
}
