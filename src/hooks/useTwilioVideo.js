import { useContext, useRef } from 'react'
import axios from 'axios'
import { connect } from 'twilio-video'
import { TwilioVideoContext } from '../wrap-with-provider'

const handleParticipant = participant => {
  const id = participant.identity

  const addTrack = track => {
    const container = document.getElementById(id)
    // Create an HTML element to show the track (e.g. <audio> or <video>).
    const media = track.attach()

    if (container) container.appendChild(media)
  }

  // Attach existing participant audio and video tracks to the DOM.
  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) addTrack(publication.track)
  })

  // If new tracks get added later, add those, too.
  participant.on('trackSubscribed', addTrack)

  // When tracks are no longer available, remove the elements displaying them.
  participant.on('trackUnsubscribed', track => {
    // Get a list of elements from detach and remove them from the DOM.
    track.detach().forEach(el => el.remove())
    // const container = document.getElementById(id)
    // if (container) container.remove()
  })
}

const useTwilioVideo = () => {
  const [store, dispatch] = useContext(TwilioVideoContext)
  const videoRef = useRef()
  const { room, token, activeRoom, loading } = store

  const getParticipantToken = async ({ identity, room }) => {
    dispatch({ type: 'loading', loading: true })

    const result = await axios({
      method: 'POST',
      url: 'https://desert-opossum-6666.twil.io/create-room-token',
      data: { identity, room },
    })

    dispatch({ type: 'join', token: result.data, identity, room, loading: false })
  }

  const connectToRoom = async () => {
    if (!token) {
      return
    }

    // Connect to the appropriate Twilio video chat room.
    const activeRoom = await connect(
      token,
      { name: room, audio: true, video: { width: 1200, height: 800 }, logLevel: 'info' }
    ).catch(error => {
      console.error(`Unable to join the room: ${error.message}`)
    })

    // Get the camera track for your preview.
    if (activeRoom && activeRoom.localParticipant && activeRoom.localParticipant.videoTracks) {
      const cameraTrack = [...activeRoom.localParticipant.videoTracks.values()][0].track
      const localEl = cameraTrack.attach()
      localEl.className = 'local-video'
      const el = document.getElementById('local-video-wrapper')
      el.appendChild(localEl)
    }

    // Handle any participants who are *already* connected to this room.
    activeRoom.participants.forEach(handleParticipant)

    // Handle participants who join *after* you’ve connected to the room.
    activeRoom.on('participantConnected', handleParticipant)
    dispatch({ type: 'set-active-room', activeRoom })
  }

  const startVideo = () => connectToRoom()
  const leaveRoom = () => dispatch({ type: 'disconnect' })

  return {
    getParticipantToken,
    startVideo,
    leaveRoom,
    activeRoom,
    room,
    token,
    videoRef,
    loading,
  }
}

export default useTwilioVideo
