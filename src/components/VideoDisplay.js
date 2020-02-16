import React, { useEffect } from 'react'
import { Button, Row, Col } from 'antd'
import { navigate } from 'gatsby'
import useTwilioVideo from '../hooks/use-twilio-video'

const VideoDisplay = ({ roomID }) => {
  const { token, videoRef, activeRoom, startVideo, leaveRoom } = useTwilioVideo()

  useEffect(() => {
    if (!roomID) {
      navigate('/')
    }

    if (!token) {
      navigate('/', { state: { room: roomID } })
    }

    if (!activeRoom) {
      startVideo()
    }

    // Add a window listener to disconnect if the tab is closed. This works
    // around a looooong lag before Twilio catches that the video is gone.
    window.addEventListener('beforeunload', leaveRoom)

    return () => {
      window.removeEventListener('beforeunload', leaveRoom)
    }
  }, [token, roomID, activeRoom, startVideo, leaveRoom])
  return (
    <>
      <Row>
        <Col xs={24} md={8}>
          <div className="chat ant-row" ref={videoRef} />
        </Col>

        <Col xs={24} md={16}>
          <div style={{ padding: 20 }}>
            <div>Chat is coming soon!!</div>
            {activeRoom && (
              <Button className="leave-room" onClick={leaveRoom}>
                Leave
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default VideoDisplay
