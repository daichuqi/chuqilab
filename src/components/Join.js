import React, { useEffect } from 'react'
import { Button } from 'antd'
import useTwilioVideo from '../hooks/use-twilio-video'
import { navigate } from 'gatsby'
import { getCurrentUser } from '../utils/auth'

const Join = ({ location }) => {
  const { getParticipantToken, room: roomName, token, loading } = useTwilioVideo()

  useEffect(() => {
    if (token && roomName) {
      navigate(`/room/${roomName}`)
    }
  }, [token, roomName])

  const join = async () => {
    const user = getCurrentUser()
    const room = 'default'
    getParticipantToken({ identity: user.username, room })
  }

  console.log('loading', loading)

  return (
    <>
      <Button loading={loading} onClick={join}>
        Join Video Chat
      </Button>
    </>
  )
}

export default Join
