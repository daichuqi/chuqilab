import { useEffect, useState } from 'react'
const io = require('socket.io-client')

const ROOM_NAME = 'chatroom'

// const BASE_URL = 'https://chuqi-node.herokuapp.com'
const BASE_URL = 'localhost:3001'

function socket() {
  const socket = io.connect(BASE_URL)

  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  socket.on('error', function(err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    console.log('register!')
    socket.emit('register', name, cb)
  }

  function join(chatroomName, cb) {
    socket.emit('join', chatroomName, cb)
  }

  function leave(chatroomName, cb) {
    socket.emit('leave', chatroomName, cb)
  }

  function message(chatroomName, msg, cb) {
    socket.emit('message', { chatroomName, message: msg }, cb)
  }

  function shareLocation(chatroomName, location, cb) {
    socket.emit('location', { chatroomName, location }, cb)
  }

  function disconnect() {
    socket.disconnect()
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  return {
    shareLocation,
    disconnect,
    register,
    join,
    leave,
    message,
    getAvailableUsers,
    registerHandler,
    unregisterHandler,
  }
}

export default function useClient() {
  const [client, setClient] = useState(undefined)

  useEffect(() => {
    const client = socket()
    const cleanUp = () => client.leave(ROOM_NAME, client.disconnect)

    setClient(client)
    window.addEventListener('beforeunload', cleanUp)

    return () => {
      cleanUp()
      window.removeEventListener('beforeunload', cleanUp)
    }
  }, [])

  return client
}
