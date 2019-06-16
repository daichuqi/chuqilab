var suite = {}

// How often to run our update function? In milliseconds. so 33 would be around 30 frames per second.
// var UPDATE_INTERVAL = 33;
var UPDATE_INTERVAL = 20

// How often to run our load update interval? (Not needed as often, just a timer.)
var LOAD_UPDATE_INTERVAL = 80
// How many total notes/pitches do we have? Make sure this matches the compiled sound SWF.
var TOTAL_NOTES = 38
// Initial tempo (beats per minute) and beats per second.
var BPM_NORM = 145
// Mininum mouse speed in pixels per millisecond.
var MOUSE_SPEED_MIN = 70
// Maximum mouse speed in pixels per millisecond.
var MOUSE_SPEED_MAX = 1500
// The mouse will grab a thread if the average speed ratio is below this threshold.
var MOUSE_SPEED_RATIO_GRAB = 0.4
// Number of measurements to consider when calculating average mouse speed.
var MOUSE_AVERAGE_COUNT = 5
// Number of threads. Make this 8 to match the Bach musical grouping.
var TOTAL_THREADS = 8
// How many total notes are in the song
var TOTAL_NOTES_IN_SONG = SONG_DATA_ARRAY.length
// Subdivision of notes for each thread. 1 = Quarter notes, 2 = eighth, etc.
var NOTE_UNIT = 2
// The value to multiply a length of string to move up one half-step, by Pythagorean scale.
var HALF_STEP_MULTIPLIER = 0.943874312681769
// Maximum length for a thread, assigned to the lowest note.
var MAX_LENGTH = 590
// Shortest length for the highest note, figured out mathematically.
var MIN_LENGTH = MAX_LENGTH * Math.pow(HALF_STEP_MULTIPLIER, TOTAL_NOTES - 1)
// Store PI as global constant.
var MATH_PI = Math.PI
// Show framerate for testing?
var SHOW_FRAMERATE = false
// Initialize mouse position on the page (Not constant)
var mouseX = 0,
  mouseY = 0

var aboutURL = 'http://www.chenalexander.com/Bach'

// Below what speed (px/frame) can a nub grab a thread instead of plucking it.
// Set this speed below the normal rate that nubs are traveling during a song
// to help performance.
var SPD_GRAB = 4
// What speed (px/frame) do we ignore plucks.
// Helps when song loops, as dots skip impossible distance.
// Also helps when dragging very quickly over all strings, will ignore some
var SPD_IGNORE_MAX = 80

// Mapping of MIDI notes from SONG_DATA_ARRAY into our musical note scale
var MIDI_MAP = {
  // Numerical keys.
  '36': 0,
  '37': 1,
  '38': 2,
  '39': 3,
  '40': 4,
  '41': 5,
  '42': 6,
  '43': 7,
  '44': 8,
  '45': 9,
  '46': 10,
  '47': 11,
  '48': 12,
  '49': 13,
  '50': 14,
  '51': 15,
  '52': 16,
  '53': 17,
  '54': 18,
  '55': 19,
  '56': 20,
  '57': 21,
  '58': 22,
  '59': 23,
  '60': 24,
  '61': 25,
  '62': 26,
  '63': 27,
  '64': 28,
  '65': 29,
  '66': 30,
  '67': 31,
  '68': 32,
  '69': 33,
  '70': 34,
  '71': 35,
  '72': 36
}

// the Web Audio "context" object
var context = null
// Array to store audio buffers and filenames
var arrBuffers, arrUrl // array of audio buffers

/**
 * Start the process once everything's loaded.
 */
suite.everythingIsReady = function() {
  if (suite.ready) {
    return
  }
  suite.ready = true
  // Tell machine it's ready.
  suite.machine.doneLoading()
}

/**
 * Start the loading process.
 */
suite.init = function() {
  suite.ready = false
  suite.initMidiMap()

  // Create Web Audio Context, future proofed for future browsers
  contextClass =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext
  if (contextClass) {
    context = new contextClass()
  } else {
    // Web Audio API not available. Ask user to use a supported browser.
  }

  // add resize listener
  window.addEventListener('resize', rsize, false)
  // mouse actions
  document.addEventListener(
    'mousemove',
    function(e) {
      mouseX = e.pageX
      mouseY = e.pageY
    },
    false
  )
  document.addEventListener(
    'mousedown',
    function(e) {
      mousePressed = true
      if (suite.machine.mouseDown != undefined) suite.machine.mouseDown(e)
      e.preventDefault()
    },
    false
  )
  document.addEventListener(
    'mouseup',
    function(e) {
      mousePressed = false
      if (suite.machine.mouseUp != undefined) suite.machine.mouseUp(e)
    },
    false
  )

  // initialize canvas
  suite.canvasEl = document.getElementById('main-canvas')
  suite.canvasObj = suite.canvasEl.getContext('2d')
  // Create guitar class.
  suite.machine = new Machine(suite.canvasObj)
  suite.indNoteLd = 0
  // invoke resize listener once now
  rsize()
  // Build our machine.
  suite.machine.build()
  suite.machine.beginLoading()
  // Begin update loop.
  setInterval(updateLoop, UPDATE_INTERVAL)

  // -----------

  // Load in the audio files.
  // Create array of audio buffers
  arrBuffers = new Array(TOTAL_NOTES)
  // Create array of URL's
  arrUrl = new Array(TOTAL_NOTES)
  var midiValue, pre
  for (var i = 0; i < TOTAL_NOTES; i++) {
    if (i < 10) pre = '0'
    else pre = ''
    arrUrl[i] = 'audio/harp_' + pre + i + '.mp3'
  }
  bufferLoader = new BufferLoader(context, arrUrl, finishedLoading)
  bufferLoader.load()
}

/**
 * Convert our MIDI_MAP into a numerical-indexed lookup array.
 */
suite.initMidiMap = function() {
  suite.arrMidiMap = new Array()
  var n
  for (key in MIDI_MAP) {
    n = parseInt(key)
    suite.arrMidiMap[n] = MIDI_MAP[key]
  }
}

/**
 * Update loop run via setInterval (see everythingIsReady)
 */
var updateLoop = function() {
  suite.machine.upd()
}

// tempoary - put this in init function called from body.onLoad
init = function() {
  suite.init()
}

/**
 * Play note with given pitch, volume, pan.
 */
suite.playSound = function(pitchPm, volPm, panPm) {
  var n = pitchPm
  var buffer = arrBuffers[n]
  var source = context.createBufferSource()
  source.buffer = buffer
  // Create a gain node.
  var gainNode = context.createGain()
  source.connect(gainNode)
  gainNode.connect(context.destination)
  // Set volume
  gainNode.gain.value = volPm
  source.start()
}

function finishedFile(bufferPm) {
  bufferLoader.finishedFile(bufferPm)
  // Which sound to load next.
  suite.indNoteLd++
}

// what to do when we're done loading sounds
function finishedLoading(bufferListPm) {
  arrBuffers = bufferListPm
  suite.soundAvailable = true
  suite.soundReady = true
  suite.everythingIsReady()
  //suite.machine.setGroup(0);
}

/**
 * Resize event, whenever browser is resized.
 * Stores new window width and height.
 */
var rsize = function() {
  width = window.innerWidth
  height = window.innerHeight
  if (suite.machine != null) suite.machine.rsize()
}

/**
 * For version testing purposes, get a variable out of URL
 * @param {Element} variable string (e.g. "id")
 * @return {number} variable value (e.g. 25)
 */
function getQueryVariable(variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return null
}
