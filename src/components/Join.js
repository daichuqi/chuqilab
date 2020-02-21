import React, { useEffect, useState, useRef } from 'react'
import { Button, Input, Row, Col } from 'antd'
import classnames from 'classnames'

import useTwilioVideo from '../hooks/use-twilio-video'
import { getCurrentUser } from '../utils/auth'

import socket from '../socket'

import VideoDisplay from './VideoDisplay'

import './Join.scss'

const Join = ({ location }) => {
  const { getParticipantToken, leaveRoom, loading, token } = useTwilioVideo()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [client, setClient] = useState(undefined)
  const [joined, setJoined] = useState(false)
  const messagesEndRef = useRef(null)
  const currentUser = getCurrentUser()

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    const client = socket()
    setClient(client)

    client.registerHandler(newMessage => {
      setMessages(messages => [...messages, newMessage])
    })

    client.register(currentUser.username, hello => {
      client.join('default', () => {
        setJoined(true)
      })
    })
  }, [])

  const join = async () => {
    getParticipantToken({ identity: currentUser.username, room: 'default' })
  }

  const onPressEnter = () => {
    if (inputValue) {
      client.message('default', inputValue, () => {
        setInputValue(undefined)
      })
    }
  }

  return (
    <div className="join-container">
      <Row>
        <Col xs={24} sm={12} md={10} lg={8}>
          <VideoDisplay />
          <div style={{ padding: 10 }}>
            {token ? (
              <Button className="leave-room" onClick={leaveRoom}>
                Turn Off Camera
              </Button>
            ) : (
              <Button loading={loading} onClick={join}>
                Turn On Camera
              </Button>
            )}
          </div>
        </Col>

        <Col xs={24} sm={12} md={14} lg={16}>
          <div className="chat-room">
            <div className="message-container">
              {messages.map(({ message, user }, i) => (
                <div
                  key={i}
                  className={classnames('message', {
                    self: user.username === currentUser.username,
                  })}
                >
                  {user.username === currentUser.username ? (
                    <>
                      <div className="message-text">{message}</div>
                      <img className="user-profile" src={user.profile_image} />
                    </>
                  ) : (
                    <>
                      <img className="user-profile" src={user.profile_image} />
                      <div className="message-text">{message}</div>
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <Input
              disabled={!joined}
              className="message-input"
              value={inputValue}
              onPressEnter={onPressEnter}
              onChange={({ target }) => setInputValue(target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Join
