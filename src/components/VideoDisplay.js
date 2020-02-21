import React, { useEffect } from 'react'
import useTwilioVideo from '../hooks/use-twilio-video'

const VideoDisplay = ({ roomID }) => {
  const { token, videoRef, activeRoom, startVideo, leaveRoom, localTrack } = useTwilioVideo()

  useEffect(() => {
    if (!activeRoom && token) {
      startVideo()
      window.addEventListener('beforeunload', leaveRoom)
    }

    // Add a window listener to disconnect if the tab is closed. This works
    // around a looooong lag before Twilio catches that the video is gone.

    return () => {
      window.removeEventListener('beforeunload', leaveRoom)
    }
  }, [token, roomID, activeRoom, startVideo, leaveRoom])

  useEffect(() => leaveRoom, [])

  // console.log('localTrack', localTrack)

  return (
    <>
      <div className="chat ant-row" ref={videoRef}>
        <div id="local-video-wrapper" className="ant-col ant-col-xs-24 local-video-wrapper"></div>
      </div>
    </>
  )
}

export default VideoDisplay
