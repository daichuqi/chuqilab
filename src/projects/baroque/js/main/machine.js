/**
 * Define constants.
 */

// Set radius of wheel and other constants.
var WHEEL_RADIUS = 172
var WHEEL_RADIUS_SQUARED = Math.pow(WHEEL_RADIUS, 2)
var WHEEL_CIRCUMFERENCE = Math.PI * WHEEL_RADIUS_SQUARED
// Length of a line segment drawn through quarter arc of circle.
var WHEEL_QUARTER_SEG = Math.sqrt(2 * WHEEL_RADIUS_SQUARED)

// How many total nubs in the machine.
var NUBS = 4
// Which thread do we want to use for the preloader (index number)
var THREAD_LOADER = 0
// Minimimum amount of time between loading sounds to wait to help preload animation,
// while strings are still building.
var TIME_BETWEEN_LOAD = 0.25
// Around how long do we want the overall build sequence to last
var LOAD_TIME_OVERALL = 12.5
// Margin around the bounding clearRect calls.
var CLEAR_RECT_MARG = 50
// How much vertical space does the stack of threads take up.
var HEIGHT_ALL_THREADS = WHEEL_QUARTER_SEG
// Below this framerate, we assume it's in a background tab threshhold.
var FPS_BACKGROUND = 2

/**
 * Builds a new Machine class, which runs everything.
 * @class This is the Machine class.
 * @constructor
 * @param {object} cvPm the Canvas context to draw in.
 */
var Machine = function(cvPm) {
  // store my canvas
  this.cv = cvPm
  // stores whether mouse is moving
  this.isMouseMoving = false
  // array of threads
  this.arrThreads = new Array()
  // Array of thread lengths for each of the notes
  this.arrLength = new Array()
  // Array of nubs
  this.arrNubs = new Array(4)
  // Store array of starting pitches for the threads
  this.arrPitchStart = new Array(TOTAL_THREADS)
  // boolean whether mouse is currently pressed
  this.isMouseDown = false
  // min max speed as a ratio
  this.rSpd = 0
  // average speed over the past few frames
  this.rSpdAvg = 0
  // how many frames to make average
  this.fAvg = 5
  //var this.bps = this.bpm/60;
  this.setTempo(BPM_NORM)
  // user speed low limit where we can grab and hold string
  // (as ratio 0 to 1)
  this.rSpdGrab = 0.4
  // tracks mouse position
  this.xp0
  this.yp0
  this.xp1
  this.yp1
  // as point objects
  this.pt0 = new Point()
  this.pt1 = new Point()
  // stores whether this is the first time running update
  this.isFirstRun = true
  this.wasResized = false
  // Is user currently holding a nub?
  this.isHoldingNub = false
  // Stores what nub the user is rolled over
  this.nubOver = null
  // Stores which index the first note of 8 is set to.
  this.indGroup = 0
  // Stores how many threads are currently grabbed by user.
  this.ctGrab = 0
  // Limit how many threads I can pluck in one frame
  this.pluckMax = 2
  // Which thread are we currently on for preloader
  this.indThreadLoader = 0
  // Are we in preload mode
  this.isIntro = true
  // Is the intro done and we can begin song whenever we're ready?
  this.isIntroDone = false
  // Stores which note we are in terms of the song
  this.noteSongRdPrev = 0
  // Are all strings at their final position?
  this.threadsInPlace = false
  // Am I currently in the background tab?
  this.isInBackground = false
  // Stores the minimum size of our bounding box just around the threads.
  this.xbLimitMin = -MAX_LENGTH * 0.5
  this.xbLimitMax = MAX_LENGTH * 0.5
  this.ybLimitMin = -HEIGHT_ALL_THREADS * 0.5
  this.ybLimitMax = HEIGHT_ALL_THREADS * 0.5
  // Stores the bounding box limits for our clearRect refresh calls.
  this.xbMin = this.xbLimitMin
  this.xbMax = this.xbLimitMax
  this.ybMin = this.ybLimitMin
  this.ybMax = this.ybLimitMax
  // Initialize machine.
  this.init()
}

/**
 * Initialize machine.
 */
Machine.prototype.init = function() {
  this.elmLoader = document.getElementById('loader')
}

/**
 * Builds the Thread objects
 */
Machine.prototype.build = function() {
  this.setOrigin()
  // Build an array of the lengths for each note.
  var lenCurr = MAX_LENGTH
  for (var i = 0; i < TOTAL_NOTES; i++) {
    this.arrLength[i] = lenCurr
    lenCurr *= HALF_STEP_MULTIPLIER
  }

  var len, str, hex, pitch
  // vertical distance between threads
  var dy = WHEEL_QUARTER_SEG / TOTAL_THREADS
  var yp = (TOTAL_THREADS / 2) * dy - 0.5 * dy
  // go through all threads and draw them
  for (var i = 0; i < TOTAL_THREADS; i++) {
    // Store the starting pitch for the threads
    this.arrPitchStart[i] = suite.arrMidiMap[SONG_DATA_ARRAY[i]]
    hex = '#FFFFFF'
    str = 3
    var pitch = -1
    var thr = new Thread(yp, pitch, str, hex, i, this.cv)
    yp -= dy
    this.arrThreads.push(thr)
  }
  // Build wheels - x, y, index, canvas
  this.wheel0 = new Wheel(WHEEL_RADIUS, 0, 0, this.cv)
  this.wheel1 = new Wheel(-WHEEL_RADIUS, 0, 1, this.cv)
  // Build nubs for them
  this.arrNubs[0] = this.wheel0.nub0 = new Nub(
    0,
    0,
    suite.machine,
    this.wheel0,
    this.cv
  )
  this.arrNubs[1] = this.wheel0.nub1 = new Nub(
    1,
    1,
    suite.machine,
    this.wheel0,
    this.cv
  )
  this.arrNubs[2] = this.wheel1.nub0 = new Nub(
    0,
    2,
    suite.machine,
    this.wheel1,
    this.cv
  )
  this.arrNubs[3] = this.wheel1.nub1 = new Nub(
    1,
    3,
    suite.machine,
    this.wheel1,
    this.cv
  )
  // composite mode
  this.cv.globalCompositeOperation = 'lighter'
  // Set the first nub as the loader nub
  this.arrNubs[0].enter()
}

/**
 * Start loading sequence
 */
Machine.prototype.beginLoading = function() {
  // initialize timer
  this.tFrame0 = this.tSong0 = this.tNotes0 = this.tLoadPrev = this.tLoading0 = this.t0 =
    new Date().getTime() / 1000
  this.ctFrame = 0
  // store current mouse pos
  this.xp0 = this.getUserX()
  this.yp0 = this.getUserY()
}

/**
 * Exit loading sequence.
 */
Machine.prototype.exitLoading = function() {
  this.isIntro = false
  // Release nubs from loading mode.
  for (var i = 0; i < this.arrNubs.length; i++) this.arrNubs[i].exitLoader()
  //var d = new Date(); this.tSong0 = this.tNotes0 = this.t0 = d.getTime()/1000;
  // update all the threads once now
  this.updThreads()
}

/**
 * When mouse button is pushed.
 */
Machine.prototype.mouseDown = function() {
  this.isMouseDown = true
}

/**
 * When mouse button is released.
 */
Machine.prototype.mouseUp = function() {
  // stop updating
  this.isMouseDown = false
}

/**
 * Set threads to batch of 8 notes starting at index n.
 */
Machine.prototype.setGroup = function(n) {
  this.indGroup = n
  for (var i = 0; i < this.arrThreads.length; i++) {
    var note = SONG_DATA_ARRAY[this.indGroup + i]
    // is it a rest?
    if (note == -1) {
      pitch = -1
    } else {
      // what pitch do we want to make it?
      pitch = suite.arrMidiMap[note]
    }
    this.arrThreads[i].setTargetPitch(pitch)
  }
}

/**
 * Set current tempo.
 */
Machine.prototype.setTempo = function(t) {
  this.bpm = t
  this.bps = t / 60
}

/**
 * Returns x position of the mouse in terms of my canvas
 * coordinate space.
 * @return {number} x position of the mouse.
 */
Machine.prototype.getUserX = function() {
  return mouseX - this.xo
}

/**
 * Returns y position of the mouse in terms of my canvas
 * coordinate space.
 * @return {number} y position of the mouse.
 */
Machine.prototype.getUserY = function() {
  return mouseY - this.yo
}

/**
 * Converts an x position in our Canvas coordinates to
 * a ratio of -1 to 1, where -1 is all the way at left,
 * and 1 is right, and 0.5 is dead center.
 * @param {number} xp is the x position to convert.
 */
Machine.prototype.xAsRatio = function(xp) {
  xp = lim(xp, 0, this.width)
  return xp / this.width
}

/**
 * Machine update that is run every frame.
 */
Machine.prototype.upd = function() {
  // At beginning of each update loop, set the bounding box to
  // at least refresh the threads.
  this.xbMin = this.xbLimitMin
  this.xbMax = this.xbLimitMax
  this.ybMin = this.ybLimitMin
  this.ybMax = this.ybLimitMax
  // Are we still loading?
  if (SHOW_FRAMERATE) this.updFramerate() // Show framerate
  if (this.isIntro) this.updLoading() // Show loading number
  // Update timing.
  if (this.isIntro) {
    this.updTime()
  } else {
    this.updTime()
  }
  // update position
  this.updPos()
  // is mouse pressed?
  if (!this.isMouseDown) {
    this.updMouseUp()
  }
  // composite mode
  if (this.wasResized) {
    this.wasResized = false
    this.cv.globalCompositeOperation = 'lighter'
  }
  // clear enter canvas
  // this.cv.clearRect(0, 0, this.width, this.height);

  // update all the threads
  //this.updThreads();
  // update the wheels
  this.updWheels()

  this.cv.clearRect(
    this.xo + this.xbMin - CLEAR_RECT_MARG,
    this.yo + this.ybMin - CLEAR_RECT_MARG,
    this.xbMax - this.xbMin + CLEAR_RECT_MARG * 2,
    this.ybMax - this.ybMin + CLEAR_RECT_MARG * 2
  )

  /*
  this.cv.fillStyle = "rgba(255,255,255,0.3)";
  this.cv.fillRect(
    this.xo+this.xbMin-CLEAR_RECT_MARG,
    this.yo+this.ybMin-CLEAR_RECT_MARG,
    this.xbMax-this.xbMin+CLEAR_RECT_MARG*2,
    this.ybMax-this.ybMin+CLEAR_RECT_MARG*2    
  );
  */
  //this.updThreads();
  this.updateAndRedrawThreads()
  this.redrawNubs()
}

/**
 * Update timing.
 */
Machine.prototype.updTime = function() {
  // how much time has elapsed since last update?
  this.t1 = new Date().getTime() / 1000
  this.elapFrame = this.t1 - this.t0
  this.t0 = this.t1

  var fps = 1 / this.elapFrame // check if we're probably in tab in the background
  if (fps <= FPS_BACKGROUND) {
    if (!this.isInBackground) {
      this.switchBackgroundMode(1)
      this.isInBackground = true
    }
  } else {
    if (this.isInBackground) {
      this.switchBackgroundMode(0)
      this.isInBackground = false
    }
  }

  // Where are we in terms of the song beats?
  this.elapSong = this.t1 - this.tSong0
  this.beatSong = this.bps * this.elapSong
  this.noteSong = this.beatSong * NOTE_UNIT
  this.noteSongRd = Math.floor(this.noteSong)

  // If we're in the intro mode
  if (this.isIntro) {
    // Are we at a new note?
    if (this.noteSongRd != this.noteSongRdPrev) {
      // Are we ready to move on now?
      if (this.isIntroDone) {
        // Did we just skip over a clean break where we can start the song?
        if (
          this.noteSongRdPrev < this.nextNoteBreak &&
          this.noteSongRd >= this.nextNoteBreak
        ) {
          // Bump
          //var d = new Date(); this.tSong0 = this.tNotes0 = this.t0 = d.getTime()/1000;
          // Set the time to where it would have been... to make it seamless.
          //this.tSong0 =
          var beatSingle = this.beatSong % 1
          var elapFudge = beatSingle / this.bps
          // Now back-date it.
          this.tSong0 = this.tNotes0 = this.t1 - elapFudge
          this.exitLoading()
        }
      }
      this.noteSongRdPrev = this.noteSongRd
    }

    // Else in normal mode
  } else {
    if (this.noteSong > this.indGroup + TOTAL_THREADS) {
      this.tNotes0 = this.t1
      // Increment to next group.
      var nextGroup = this.indGroup + TOTAL_THREADS
      // Have we reached the end of the song?
      if (nextGroup >= TOTAL_NOTES_IN_SONG) {
        nextGroup = 0
        // Reset the song counter point
        this.tSong0 = this.t1
      }
      this.setGroup(nextGroup)
    }
  }

  // Where is the next clean break where we can start the song.
  // Should round to groups of 32 (or 16?)
  this.nextNoteBreak = this.noteSongRd + (32 - (this.noteSongRd % 32))
}

/**
 * Goes through all Threads and updates and redraws them
 */
Machine.prototype.updWheels = function() {
  // set left wheel rotation
  var rot
  //
  this.wheel0.setRot(
    (MATH_PI * (0.25 + ((this.beatSong % 16) / 16) * 2)) % (2 * MATH_PI)
  )
  this.wheel1.setRot(
    (MATH_PI * (0.25 - ((this.beatSong % 16) / 16) * 2)) % (2 * MATH_PI)
  )
  //
  this.wheel0.upd()
  this.wheel1.upd()
}

/**
 * Update timing.
 */
Machine.prototype.switchBackgroundMode = function(n) {
  switch (n) {
    // turn on background mode
    case 1:
      break
    // turn off background mode
    case 0:
      for (var i = 0; i < 4; i++) this.arrNubs[i].returnFromBackground()
      break
    default:
      break
  }
}

/**
 * Redraw wheels.
 */
Machine.prototype.redrawNubs = function() {
  this.wheel0.nub0.redraw()
  this.wheel0.nub1.redraw()
  this.wheel1.nub0.redraw()
  this.wheel1.nub1.redraw()
}

/**
 * Goes through all Threads and updates and redraws them
 */
Machine.prototype.updThreads = function() {
  for (var i = 0; i < this.arrThreads.length; i++) {
    this.arrThreads[i].upd()
  }
}

/**
 * Goes through all Threads and updates and redraws them
 */
Machine.prototype.redrawThreads = function() {
  for (var i = 0; i < this.arrThreads.length; i++) {
    this.arrThreads[i].redraw()
  }
}

/**
 * Goes through all Threads and updates and redraws them
 */
Machine.prototype.updateAndRedrawThreads = function() {
  for (var i = 0; i < this.arrThreads.length; i++) {
    this.arrThreads[i].upd()
    this.arrThreads[i].redraw()
  }
}

/**
 * Update status text.
 */
Machine.prototype.updLoading = function() {
  var str
  // are we loading audio?
  if (!suite.soundReady) {
    var perc = Math.round((suite.indNoteLd / TOTAL_NOTES) * 100)
    //str = "Loading sound ("+ perc + "%)";
    if (SHOW_FRAMERATE) {
      //this.elmLoader.innerHTML += "<span class=\"loading\">" + str + "</span>";
    } else {
      //this.elmLoader.innerHTML = "<span class=\"loading\">" + str + "</span>";
    }
  }
  // How much time since we last updated the load animation?
  this.tLoadCurr = new Date().getTime() / 1000
  var elap = this.tLoadCurr - this.tLoadPrev

  // How long has the loading sequence lasted?
  this.rLoad = (this.tLoadCurr - this.tLoading0) / LOAD_TIME_OVERALL
  if (this.rLoad >= 1) this.rLoad = 1
  // Time to go?
  if (elap > TIME_BETWEEN_LOAD) {
    this.tLoadPrev = this.tLoadCurr
    this.incrLoad()
  }
}

/**
 * Update framerate counter
 */
Machine.prototype.updFramerate = function() {
  this.tFrame1 = new Date().getTime() / 1000
  var elap = this.tFrame1 - this.tFrame0
  this.tFrame0 = this.tFrame1

  // are we loading audio?
  this.ctFrame++
  if (this.ctFrame % 5 == 0) {
    this.numFrame = Math.round(100 / elap) / 100
  }
  this.elmLoader.innerHTML =
    '<span class="loading">' + this.numFrame + '</span> &nbsp; '
}

/**
 * Go to next step in loading thread animation.
 */
Machine.prototype.incrLoad = function() {
  // Release another nub?
  var nub
  if (this.rLoad > 0.15) {
    nub = this.arrNubs[2]
    if (!nub.hasEntered) nub.enter()
    nub = this.arrNubs[0]
    if (!nub.hasEntered) nub.enter() // Double check that the first one has entered, it skipped once
  }
  if (this.rLoad > 0.85) {
    nub = this.arrNubs[1]
    if (!nub.hasEntered) nub.enter()
  }
  if (this.rLoad > 0.97) {
    nub = this.arrNubs[3]
    if (!nub.hasEntered) nub.enter()
  }

  // How many threads to currently show?
  var rCut0 = 0.4
  var rCut1 = 0.8
  var rShow
  if (this.rLoad < rCut0) {
    rShow = 0 // Only show one thread for a while.
  } else {
    rShow = (this.rLoad - rCut0) / (rCut1 - rCut0)
    if (rShow > 1) rShow = 1
  }
  var showThreads = rShow * TOTAL_THREADS
  // Start at a random place.
  var ind = Math.floor(Math.random() * 0.999 * showThreads)
  var pitchStart, pitchTarg, thr
  var ctThreadsInPlace = 0
  // Cycle through the threads.
  for (var i = 0; i < TOTAL_THREADS; i++) {
    if (i > showThreads) break
    pitchStart = this.arrPitchStart[ind]
    thr = this.arrThreads[ind]
    // Is that thread already at its target?
    if (thr.pitchInd == pitchStart) {
      ind = (ind + 1) % TOTAL_THREADS // Just continue.
      ctThreadsInPlace++
    } else {
      // Want to increment thread to its next note. Have we loaded that note?
      var incr
      if (showThreads == 0) {
        incr = 1
      } else {
        incr = 1 + Math.round(Math.random() * 2)
      }
      // Have notes slowly ease up as time progresses
      off = Math.floor(lerp(-3, 0, this.rLoad))
      pitchTarg = thr.pitchInd + incr + off
      if (pitchTarg < 0) pitchTarg = 0
      // Make sure it's not higher than what we want
      if (pitchTarg > pitchStart) pitchTarg = pitchStart
      if (suite.indNoteLd > 0 && suite.indNoteLd - 1 >= pitchTarg) {
        thr.setTargetPitch(pitchTarg)
        break
      }
    }
  }
  // Did we find a thread to change?
  if (ctThreadsInPlace == TOTAL_THREADS && !this.threadsInPlace)
    this.threadsInPlace = true

  // If all threads are in place, and sound is loaded, we now begin.
  if (
    this.threadsInPlace &&
    suite.soundReady &&
    this.rLoad >= 1 &&
    !this.isIntroDone
  ) {
    this.isIntroDone = true
  }
}

/**
 * Goes through all Threads and counts up how many are grabbed
 * or oscillating, so we know whether we need to redraw.
 */
Machine.prototype.checkMoving = function() {
  //var ctGrab = 0;
  var ctOsc = 0
  for (var i = 0; i < this.arrThreads.length; i++) {
    //if (this.arrThreads[i].isGrabbed) ctGrab++;
    if (this.arrThreads[i].isOsc) ctOsc++
  }
}

/**
 * Returns user's mouse speed as ratio 0 to 1, normalized to
 * the bounds of spdMin and spdMax. This is set in update loop.
 * @return {number} user's mouse speed as ratio 0 to 1
 */
Machine.prototype.getSpd = function() {
  return this.rSpd
}

/**
 * Returns user's mouse speed as ratio 0 to 1, normalized to
 * the bounds of spdMin and spdMax. This is set in update loop.
 * Difference is it is averaged every few frames.
 * @return {number} user's mouse speed as ratio 0 to 1
 */
Machine.prototype.getSpdAvg = function() {
  return this.rSpdAvg
}

/**
 * Update loop run every frame, triggered by #upd.
 */
Machine.prototype.updPos = function() {
  // get new position
  this.xp1 = this.getUserX()
  this.yp1 = this.getUserY()
  // update point objects
  this.pt0.x = this.xp0
  this.pt0.y = this.yp0
  this.pt1.x = this.xp1
  this.pt1.y = this.yp1
  //
  this.dx = this.xp1 - this.xp0
  this.dy = this.yp1 - this.yp0
  //
  this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
  // is the mouse moving?
  this.isMouseMoving = this.dist > 0.2
  // current speed - pixels per second
  this.spd = this.dist / this.elapFrame
  // normalize it from 0 to 1
  this.rSpd = lim(
    (this.spd - MOUSE_SPEED_MIN) / (MOUSE_SPEED_MAX - MOUSE_SPEED_MIN),
    0,
    1
  )
  // get average
  this.rSpdAvg =
    (this.rSpdAvg * (this.fAvg - 1)) / this.fAvg + this.rSpd * (1 / this.fAvg)
  // store previous position
  this.xp0 = this.xp1
  this.yp0 = this.yp1
}

/**
 * Update mode while mouse is up.
 */
Machine.prototype.updMouseUp = function() {
  // Are we already rolled over one?
  if (this.nubOver != null && !this.isHoldingNub) {
    // Make sure we're still over that one
    if (this.nubOver.checkMouseOver()) {
      return // We're still over it, ignore others
    } else {
      this.nubOver.rollOut() // We rolled out of it.
      this.nubOver = null
    }
  }

  // Check if we're rolled over any nubs
  for (var i = 0; i < 4; i++) {
    if (this.arrNubs[i].checkMouseOver()) {
      this.nubOver = this.arrNubs[i]
      this.nubOver.rollOver()
      break // Don't check anymore, only roll over one at a time
    }
  }
}

/**
 * Triggered when mouse is pressed.
 */
Machine.prototype.mouseDown = function() {
  this.isMouseDown = true
  // Are we over a nub?
  if (this.nubOver != null) {
    this.nubOver.grab() // grab it
    this.isHoldingNub = true // Remember we're holding a nub
  }
}

/**
 * Triggered when mouse is released.
 */
Machine.prototype.mouseUp = function() {
  this.isMouseDown = false
  // We we holding a nub?
  if (this.isHoldingNub) {
    this.nubOver.drop()
    this.isHoldingNub = false
  }
}

/**
 * Drop all strings that are currently grabbed.
 */
Machine.prototype.dropAll = function() {
  for (var i = 0; i < this.arrThreads.length; i++) {
    if (this.arrThreads[i].isGrabbed) this.arrThreads[i].drop()
  }
}

/**
 * Done loading.
 */
Machine.prototype.doneLoading = function() {
  // hide the "loading audio text"
  if (!SHOW_FRAMERATE) this.elmLoader.style.display = 'none'
}

/**
 * Triggered everytime window is resized.
 */
Machine.prototype.checkBoxLimit = function(x, y) {
  // Is this beyond the limit of the current bounding box?
  if (x < this.xbMin) this.xbMin = x
  else if (x > this.xbMax) this.xbMax = x
  //
  if (y < this.ybMin) this.ybMin = y
  else if (y > this.ybMax) this.ybMax = y
}

/**
 * Triggered everytime window is resized.
 */
Machine.prototype.rsize = function() {
  this.wasResized = true
  // make the canvas objects match window size
  this.width = suite.canvasEl.width = window.innerWidth
  this.height = suite.canvasEl.height = window.innerHeight
  // move the loader box
  this.elmLoader.style.left = '20px'
  this.elmLoader.style.top = this.height - 28 + 'px'
  // move the about ? box
  // update the origin
  this.setOrigin()
}

/**
 * Updates the origin point.
 */
Machine.prototype.setOrigin = function() {
  this.xo = Math.round(this.width / 2)
  this.yo = Math.round(this.height / 2)
}
