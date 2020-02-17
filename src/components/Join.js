import React, { useEffect } from 'react'
import { Button } from 'antd'
import useTwilioVideo from '../hooks/use-twilio-video'
import { navigate } from 'gatsby'
import { getCurrentUser } from '../utils/auth'

const Join = ({ location }) => {
  const { getParticipantToken, room, token, loading } = useTwilioVideo()

  useEffect(() => {
    if (token && room) {
      console.log('token', token)
      console.log('room', room)
      navigate(`/room/${room}`)
    }
  }, [token, room])

  const join = async () => {
    const user = getCurrentUser()
    getParticipantToken({ identity: user.username, room: 'default' })
  }

  return (
    <div>
      <Button loading={loading} onClick={join}>
        Join Video Chat
      </Button>
    </div>
  )
}

export default Join
