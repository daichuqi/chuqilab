import React, { Component } from 'react'
import { Progress } from 'antd'

import { MIDI_MAP, UPDATE_INTERVAL, TOTAL_NOTES } from './configs'
import Machine from './machine'
import BufferLoader from './bufferLoader'

import './style.scss'

export default class Baroque extends Component {
  state = {
    progress: 0,
    start: false,
  }
  componentDidMount = () => {
    this.initMidiMap()

    // Create Web Audio Context, future proofed for future browsers
    const contextClass =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext

    if (contextClass) {
      this.audioContext = new contextClass()
    } else {
      // Web Audio API not available. Ask user to use a supported browser.
    }

    window.addEventListener('resize', this.rsize, false)

    document.addEventListener(
      'mousedown',
      e => {
        this.mousePressed = true
        if (this.machine.mouseDown != undefined) {
          this.machine.mouseDown(e)
        }
        e.preventDefault()
      },
      false
    )

    document.addEventListener(
      'mouseup',
      e => {
        this.mousePressed = false
        if (this.machine.mouseUp != undefined) {
          this.machine.mouseUp(e)
        }
      },
      false
    )

    this.canvasEl = this.refs.canvas
    this.elmLoader = this.refs.loader
    this.canvasObj = this.canvasEl.getContext('2d')
    this.machine = new Machine(this.canvasObj, this, this.elmLoader)
    // invoke resize listener once now

    // Load in the audio files.
    // Create array of audio buffers
    this.arrBuffers = Array(TOTAL_NOTES)
    this.arrUrl = Array(TOTAL_NOTES)
      .fill(null)
      .map((v, i) => {
        if (i < 10) i = `0${i}`
        return `https://s3-us-west-2.amazonaws.com/baroque.me/harp_${i}.mp3`
      })

    this.indNoteLd = 0
    const bufferLoader = new BufferLoader(
      this.audioContext,
      this.arrUrl,
      this.finishedLoading,
      () => {
        this.indNoteLd++
        this.setState({ progress: this.state.progress + 1 })
      }
    )
    bufferLoader.load()
  }

  begin = () => {
    this.setState({ start: true })
    this.rsize()

    // Build our machine.
    this.machine.build()
    this.machine.beginLoading()

    setInterval(() => {
      this.machine.upd()
    }, UPDATE_INTERVAL)
  }

  initMidiMap = () => {
    this.arrMidiMap = new Array()
    var n
    for (let key in MIDI_MAP) {
      n = parseInt(key)
      this.arrMidiMap[n] = MIDI_MAP[key]
    }
  }

  // what to do when we're done loading sounds
  finishedLoading = bufferListPm => {
    this.arrBuffers = bufferListPm
    this.soundAvailable = true
    this.soundReady = true
    this.everythingIsReady()
  }

  /**
   * Play note with given pitch, volume, pan.
   */
  playSound = (pitchPm, volPm, panPm) => {
    var buffer = this.arrBuffers[pitchPm]
    var source = this.audioContext.createBufferSource()

    source.buffer = buffer
    // Create a gain node.
    var gainNode = this.audioContext.createGain()
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    // Set volume
    gainNode.gain.value = volPm
    source.start()
  }

  rsize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight
    if (this.machine != null) {
      this.machine.rsize()
    }
  }

  everythingIsReady = () => {
    this.machine.doneLoading()
    this.setState({ ready: true })
  }

  render() {
    var perc = Math.round((this.state.progress / TOTAL_NOTES) * 100)
    return (
      <div id="baroque">
        {!this.state.start && (
          <div className="center-loading">
            <div className="button-wrapper">
              <Progress
                strokeWidth={32}
                showInfo={false}
                strokeColor="rgb(162, 26, 26)"
                percent={perc}
              />

              <div
                className="start-button"
                onClick={() => {
                  if (this.state.ready) {
                    this.begin()
                  }
                }}
              >
                {this.state.ready ? 'Play' : 'Loading...'}
              </div>
            </div>
          </div>
        )}
        <canvas id="canvas" ref="canvas"></canvas>
        <div id="loader" ref="loader"></div>
        <div id="framerate"></div>
      </div>
    )
  }
}
