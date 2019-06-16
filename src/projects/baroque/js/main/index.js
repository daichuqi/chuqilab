import React, { Component } from 'react'
import { MIDI_MAP, UPDATE_INTERVAL, TOTAL_NOTES } from './configs'
import Machine from './machine'
import BufferLoader from './BufferLoader'

import './style.css'

export default class Baroque extends Component {
  componentDidMount = () => {
    this.ready = false
    this.initMidiMap()

    // Create Web Audio Context, future proofed for future browsers
    const contextClass =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext
    if (contextClass) {
      this.context = new contextClass()
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
    this.indNoteLd = 0
    // invoke resize listener once now
    this.rsize()
    // Build our machine.
    this.machine.build()
    this.machine.beginLoading()

    setInterval(() => {
      this.machine.upd()
    }, UPDATE_INTERVAL)

    // Load in the audio files.
    // Create array of audio buffers
    this.arrBuffers = new Array(TOTAL_NOTES)
    // Create array of URL's
    this.arrUrl = new Array(TOTAL_NOTES)
    var pre
    for (var i = 0; i < TOTAL_NOTES; i++) {
      if (i < 10) pre = '0'
      else pre = ''
      this.arrUrl[i] = `audio/harp_${pre}${i}.mp3`
    }
    const bufferLoader = new BufferLoader(
      this.context,
      this.arrUrl,
      this.finishedLoading,
      () => {
        this.indNoteLd++
      }
    )
    bufferLoader.load()
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
    var n = pitchPm
    var buffer = this.arrBuffers[n]
    var source = this.context.createBufferSource()
    source.buffer = buffer
    // Create a gain node.
    var gainNode = this.context.createGain()
    source.connect(gainNode)
    gainNode.connect(this.context.destination)
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

  initMidiMap = () => {
    this.arrMidiMap = new Array()
    var n
    for (let key in MIDI_MAP) {
      n = parseInt(key)
      this.arrMidiMap[n] = MIDI_MAP[key]
    }
  }

  /**
   * Start the process once everything's loaded.
   */
  everythingIsReady = () => {
    if (this.ready) {
      return
    }
    this.ready = true
    // Tell machine it's ready.
    this.machine.doneLoading()
  }

  render() {
    return (
      <div id="baroque">
        <div id="main-layer">
          <canvas id="canvas" ref="canvas"></canvas>
        </div>
        <div id="loader" ref="loader"></div>
        <div id="framerate"></div>
      </div>
    )
  }
}
