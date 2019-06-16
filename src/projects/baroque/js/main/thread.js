/**
 * @fileoverview This file contains the Thread class.
 * @author Alexander Chen alex@chenalexander.com
 * @version 0.1
 */

/**
 * Defines a range for the distance that we can pull long threads
 * perpendicularly from middle point of the thread, in pixels.
 * Essentially, how taut or loose a thread is.
 */
var SLACK_LONG = 10
var SLACK_SHORT = 10

/**
 * Defines perpendicular distance between the thread and a cursor
 * to allow it to do an instant grab when mouse is pressed.
 */
var DISTANCE_INSTANT_GRAB = 8

/**
 * This value adjusts the curvature at the control point
 * where a thread is held. This should be set as a ratio from 0 to 1.
 * A value of 0 creates no curve, resulting in a sharp point
 * and a value of 1 creates a wide arc. Values around 0.5 work best.
 */
var CURVATURE_RATIO = 0.45

/**
 * Defines a range for the oscillation speed of low note threads by the number
 * of pixels the center point will travel per update call.
 */
var OSCILLATION_SPEED_LOW_NOTES = 1.2
var OSCILLATION_SPEED_HIGH_NOTES = 3.0

/**
 * When a user brushes over a thread without grabbing onto it, move the thread
 * this many pixels so that we always show some movement.
 * @type {number}
 * @const
 */
var MINIMUM_AMPLITUDE = 7

/**
 * Defines a range for the amplitude dampening of low note threads.
 * Every update call, the amplitude is dampened by using this ratio
 * as a multiplier.
 */
var AMPLITUDE_DAMPEN_LOW_NOTES = 0.92
var AMPLITUDE_DAMPEN_HIGH_NOTES = 0.87

/**
 * Minimum and maximum volume used when playing a note.
 */
var VOLUME_MIN = 0.5
var VOLUME_MAX = 0.7

/**
 * The farthest left and right that a note can be played.
 */
var PAN_LEFT = -0.3
var PAN_RIGHT = 0.3

/**
 * Builds a new Thread, a pluckable string.
 * @class This is the Thread class.
 * @constructor
 * @param {number} ypPm Description
 */
var Thread = function(ypPm, pitchPm, strPm, hexPm, indPm, cvPm) {
  // Initialize point objects.
  this.pt0 = new Point(0, 0)
  this.pt1 = new Point(0, 0)
  // Y position for the thread.
  this.yp0 = this.yp1 = ypPm
  // set my initial pitch.
  this.pitchInd = pitchPm
  // Set initial length
  this.len = 0
  // my permanent midpoint
  this.xMid
  this.yMid
  // the position of my swinging pendulum point (midpoint)
  this.xc
  this.yc
  // my grabbed point by user
  this.xg
  this.yg
  this.xgi
  this.ygi
  this.xg1
  this.yg1
  this.xg0
  this.yg0
  // drawing point
  this.xd
  this.yd
  // store permanent dx, dy
  this.dx
  this.dy
  // minimum distance to move (px), amplitude, so if you brush it it
  // always shows movement
  this.ampPxMin = 3
  this.freq
  this.ampDamp
  // temporary distance variables
  this.distMax
  this.distPerp
  // stores ratio from 0 to 1 where user has grabbed along the string
  this.rGrab
  this.rHalf
  // my main angle
  this.ang
  // my perpendicular angle
  this.angPerp
  // total length of this thread (when unstretched)
  this.len
  // temporary variables
  this.dx0
  this.dy0
  this.dx1
  this.dy1
  this.dist0
  this.dist1
  this.dxBez0
  this.dyBez0
  this.dxBez1
  this.dyBez1
  // my index number
  this.ind = indPm
  // set stroke weight from parameters
  this.str = strPm
  // set hex range from parameter
  this.hex = hexPm // in normal state
  // store as RGB color values too
  this.col = hex2rgb(this.hex)
  // counter for oscillation
  this.t = 0
  // current amplitude
  this.ampStart
  this.amp
  this.ampMax
  // current stretch strength as ratio
  this.rStrength
  // is update on
  this.isUpdOn = false
  // oscillation direction
  this.oscDir
  // currently grabbed
  this.isGrabbed = false
  // currently oscillating
  this.isOsc = false
  // was just dropped
  this.isFirstOsc = false
  // Is currently resizing
  this.isShifting = false
  // car that is grabbing me
  this.carGrab = null

  // link to main canvas
  this.cv = cvPm
  // initialize
  this.init()
}

/**
 * Initializes the Thread instance.
 */
Thread.prototype.init = function() {
  // link to main machine class
  this.m = suite.machine
  // update my position to initialize
  this.updPos()
}

/**
 * Set length of thread.
 */
Thread.prototype.setTargetPitch = function(p) {
  // Is it a rest? (-1 pitch)
  if (p == -1) {
    this.pitchInd = -1
    var lenTarg = 0
  } else {
    // Set my new pitch right away.
    this.pitchInd = p
    // My pitch as a ratio from 0 to 1.
    this.rPitch = this.pitchInd / (TOTAL_NOTES - 1)
    // The length we want to ease to to make this pitch work:
    //var lenTarg = lerp(MIN_LENGTH, MAX_LENGTH, 1-this.rPitch);
    var lenTarg = this.m.arrLength[this.pitchInd]
  }
  if (lenTarg != this.len) this.easeToLength(lenTarg)
}

/**
 * Set length of thread.
 */
Thread.prototype.setLength = function(l) {
  this.len = l
  // update position
  this.updPos()
}

/**
 * Ease to new target length.
 */
Thread.prototype.easeToLength = function(l) {
  this.isShifting = true
  this.lenTarg = l
}

/**
 * Update while thread is shifting size.
 */
Thread.prototype.updShifting = function() {
  var ease = 0.2
  var dl = (this.lenTarg - this.len) * ease
  // Already there?
  if (Math.abs(dl) < 1) {
    // Set it and stop updating.
    this.setLength(this.lenTarg)
    this.isShifting = false
  } else {
    this.setLength(this.len + dl)
  }
}

/**
 * Update the start and end positions.
 */
Thread.prototype.updPos = function() {
  // set new x positions
  this.xp0 = -this.len / 2
  this.xp1 = this.len / 2

  // Update the point objects for the endpoints.
  this.pt0.setX(this.xp0)
  this.pt0.setY(this.yp0)
  this.pt1.setX(this.xp1)
  this.pt1.setY(this.yp1)
  //
  this.dx = this.xp1 - this.xp0
  this.dy = this.yp1 - this.yp0
  // store midpoint
  this.xMid = this.xp0 + this.dx * 0.5
  this.yMid = this.yp0 + this.dy * 0.5
  // store angle
  this.ang = Math.atan2(this.dy, this.dx)
  //
  this.angPerp = Math.PI / 2 - this.ang
  // set new length
  // this.len = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
  // initially set pendulum to midpoint
  this.xc = this.xMid
  this.yc = this.yMid
  // Store max distance we can pull from middle of the thread perpendicularly,
  // i.e. looseness of the thread.
  this.distMax = lerp(
    SLACK_SHORT,
    SLACK_LONG,
    (this.len - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH)
  )
  // set my oscillation frequency
  this.freq = lerp(
    OSCILLATION_SPEED_LOW_NOTES,
    OSCILLATION_SPEED_HIGH_NOTES,
    this.rPitch
  )
  this.ampDamp = lerp(
    AMPLITUDE_DAMPEN_LOW_NOTES,
    AMPLITUDE_DAMPEN_HIGH_NOTES,
    this.rPitch
  )
  // my maximum amplitude
  this.ampMax = this.distMax
  // store the sin and cos of my angle and perpendicular angle
  // so that we're not recalculating it every frame
  this.sinAng = Math.sin(this.ang)
  this.cosAng = Math.cos(this.ang)
  this.sinPerp = Math.sin(this.angPerp)
  this.cosPerp = Math.cos(this.angPerp)
}

/**
 * Redraw my thread on the canvas.
 */
Thread.prototype.redraw = function() {
  if (this.len == 0) return

  // current origin point
  this.xo = this.m.xo
  this.yo = this.m.yo

  // weird bug - the first time we run it with the first thread, it breaks
  if (isNaN(this.xp1)) {
    return
  }

  this.cv.beginPath()
  this.cv.lineCap = 'round'
  this.cv.strokeStyle = this.hex
  this.cv.lineWidth = this.str

  // grabbed mode (or on the first osc after being dropped)
  if (this.isGrabbed || this.isFirstOsc) {
    this.xd = this.xg
    this.yd = this.yg
    // oscillating freely mode
  } else {
    this.xd = this.xc
    this.yd = this.yc
  }

  if (isNaN(this.xd)) {
    return
  }

  this.dx0 = this.xd - this.xp0
  this.dy0 = this.yd - this.yp0
  this.dx1 = this.xp1 - this.xd
  this.dy1 = this.yp1 - this.yd
  // distance
  this.dist0 = Math.sqrt(this.dx0 * this.dx0 + this.dy0 * this.dy0)
  this.dist1 = Math.sqrt(this.dx1 * this.dx1 + this.dy1 * this.dy1)
  // move to the center pendulum point
  this.dxBez0 = CURVATURE_RATIO * this.dist0 * this.cosAng
  this.dyBez0 = CURVATURE_RATIO * this.dist0 * this.sinAng
  // move to the center pendulum point
  this.dxBez1 = CURVATURE_RATIO * this.dist1 * this.cosAng
  this.dyBez1 = CURVATURE_RATIO * this.dist1 * this.sinAng
  // move to start point
  this.cv.moveTo(this.xp0 + this.xo, this.yp0 + this.yo)
  // Draw bezier curve
  this.cv.bezierCurveTo(
    this.xd - this.dxBez0 + this.xo,
    this.yd - this.dyBez0 + this.yo,
    this.xd + this.dxBez1 + this.xo,
    this.yd + this.dyBez1 + this.yo,
    this.xp1 + this.xo,
    this.yp1 + this.yo
  )
  // close path
  this.cv.stroke()
  this.cv.closePath()
}

/**
 * Update function run every frame.
 * Triggers other update functions.
 */
Thread.prototype.upd = function() {
  // Is thread currently shifting size?
  if (this.isShifting) {
    this.updShifting()
  }
  // is thread currently grabbed
  if (this.isGrabbed) {
    this.updGrab()
    // is thread currently oscillating
  } else if (this.isOsc) {
    this.updOsc()
  }
}

/**
 * Update this thread when I am in oscillation
 * mode after being plucked.
 */
Thread.prototype.updOsc = function() {
  // ease it back to the zero line first
  if (this.isFirstOsc) {
    var ease = 0.8
    var dxg = this.xg1 - this.xg
    var dyg = this.yg1 - this.yg
    //
    this.xg += dxg * ease
    this.yg += dyg * ease
    // have we arrived?
    if (Math.abs(dxg) < 2 && Math.abs(dyg) < 2) {
      // initialize
      this.t = 0
      this.oscDir = 1
      this.isFirstOsc = false
      // which direction it has been going in
      var sx0 = sign(dxg)
      var sx1 = sign(this.sinAng)
      // reverse the initial oscillation direction if needed
      if (sx0 != sx1) {
        this.oscDir *= -1
      }
    }
  } else {
    // increment counter
    this.t += this.freq * this.oscDir
    // make c oscillate between 0 and 1 with sin
    var c = Math.sin(this.t)
    // dampen the amplitude
    this.amp *= this.ampDamp
    //
    this.xc = this.xMid + c * this.sinAng * this.amp
    this.yc = this.yMid - c * this.cosAng * this.amp
    // 3/10 - lowered limit so that colors continue easing out
    // if amplitude is below mimum, cut it
    if (this.amp <= 0.15) {
      this.amp = 0
      this.isOsc = false
      // every time a string stops oscillating,
      // just tally to see if anything is moving
      this.m.checkMoving()
    }
  }
}

/**
 * Update mode while I am being held/grabbed by the
 * the user.
 */
Thread.prototype.updGrab = function() {
  // get current mouse position
  // grabbed by car?
  if (this.carGrab != null) {
    var xu = this.carGrab.xp1
    var yu = this.carGrab.yp1
    // else grabbed by user
  } else {
    var xu = this.m.getUserX()
    var yu = this.m.getUserY()
  }

  // how far away is it from the line
  var dxu = xu - this.xp0
  var dyu = yu - this.yp0
  // angle
  var ang0 = Math.atan2(dyu, dxu)
  var ang1 = this.ang - ang0
  // direct distance
  var hyp = Math.sqrt(dxu * dxu + dyu * dyu)
  // perpendicular distance
  this.distPerp = hyp * Math.sin(ang1)
  // distance parallel along the line
  var distPara = hyp * Math.cos(ang1)
  // how far as a ratio from 0 to 1 are we on the line
  this.rGrab = lim(distPara / this.len, 0, 1)
  // normalize it to increase to 1 at the halfway point
  if (this.rGrab <= 0.5) {
    this.rHalf = this.rGrab / 0.5
  } else {
    this.rHalf = 1 - (this.rGrab - 0.5) / 0.5
  }
  // what distance can we pull the string at this point?
  var distMaxAllow = this.distMax * this.rHalf
  // set the current stretch strength
  this.rStrength = lim(Math.abs(this.distPerp) / this.distMax, 0, 1)

  // has the user's point pulled too far?
  if (Math.abs(this.distPerp) > distMaxAllow) {
    this.drop()
  } else {
    // that grabbed point is ok, allow it
    this.xg = xu
    this.yg = yu
  }
}

/**
 * When user brushes over string in one frame and
 * does not grab it, pluck is run. Also used for auto-pluck by
 * keystrokes.
 * @param {number} xp is x position where user intersected Thread.
 * @param {number} yp is y position where user intersected Thread.
 * @param {boolean} isNub: true if doing pluck by a nub.
 */
Thread.prototype.pluck = function(xp, yp, isNub, car) {
  // store as initial position
  this.xgi = this.xg = xp
  this.ygi = this.yg = yp
  // user's current mouse position
  var xu = this.m.getUserX()
  var yu = this.m.getUserY()
  // how far away is it from the line
  var dxu = xu - this.xp0
  var dyu = yu - this.yp0
  // use our current xg and yg, that's where the user
  // intersected the string
  var dxg = this.xgi - this.xp0
  var dyg = this.ygi - this.yp0
  var hyp = Math.sqrt(dxu * dxu + dyu * dyu)
  // as ratio 0 to 1
  this.rGrab = lim(hyp / this.len, 0, 1)
  // normalize it to increase to 1 at the halfway point
  if (this.rGrab <= 0.5) {
    this.rHalf = this.rGrab / 0.5
  } else {
    this.rHalf = 1 - (this.rGrab - 0.5) / 0.5
  }
  var distMaxAllow = this.distMax * this.rHalf
  // Base on user's speed if it was plucked normally by mouse,
  // otherwise use max speed
  var spdAvg = isNub ? 1 : this.m.getSpdAvg()
  // how far do we want it to pull?
  this.distPerp = (1 - spdAvg) * distMaxAllow
  // set new strength
  if (isNub) {
    this.rStrength = 1
  } else {
    this.rStrength = lim(Math.abs(this.distPerp) / this.distMax, 0, 1)
  }

  // less than minimum? (always vibrate string a little bit)
  if (this.distPerp < this.ampPxMin) this.distPerp = this.ampPxMin
  // set it
  this.xg = this.xgi + this.distPerp * this.cosPerp
  this.yg = this.ygi + this.distPerp * this.sinPerp
  // ------------------
  // reset me to the center point
  this.xc = this.xMid
  this.yc = this.yMid
  // already oscillating?
  if (this.isOsc) {
    // already oscillating - boost the oscillation strength just a bit
    this.rStrength = lim(this.rStrength * 0.5 + this.amp / this.ampMax, 0, 1)
    // set new amplitude
    this.amp = this.rStrength * this.ampMax
    // not oscillating - start oscillating now
  } else {
    // store current amplitude based on strength
    this.amp = this.rStrength * this.ampMax
    // start oscillating
    this.startOsc()
  }
  var rPan = this.m.xAsRatio(xp)
  // play note
  this.playNote(this.rStrength, rPan, false)
}

/**
 * User grabs this thread to hold onto it.
 * @param {number} xp is x position where user grabbed Thread.
 * @param {number} yp is y position where user grabbed Thread.
 */
Thread.prototype.grab = function(xp, yp, isNub, car) {
  if (!isNub) {
    //
    this.carGrab = null
  } else {
    // store car that is grabbing me, and link me to the car
    this.carGrab = car
    this.carGrab.thrGrab = this
    // grabbed by car
  }
  // store as initial position
  this.xgi = this.xg = xp
  this.ygi = this.yg = yp
  this.isGrabbed = true
  //
  this.m.ctGrab++
  // update once now
  this.updGrab()
}

/**
 * User is currently grabbing and thread and releases it, triggering
 * drop() function.
 */
Thread.prototype.drop = function() {
  this.m.ctGrab--
  //
  this.isGrabbed = false
  // reset me
  this.xc = this.xMid
  this.yc = this.yMid
  // store current amplitude based on strength
  this.amp = this.rStrength * this.ampMax
  // play note - is it by a car?
  if (this.carGrab != null) {
    //var vol = lerp(VOLUME_MIN, VOLUME_MAX, this.rStrength);
    this.carGrab.thrGrab = null
    this.carGrab = null
    // else use normal user volume limits
  } else {
    //var vol = lerp(VOLUME_MIN, VOLUME_MAX, this.rStrength);
    //var pan = this.m.xAsRatio(this.m.getUserX());
  }
  // set panning ratio -1 to 1
  var rPan = this.m.xAsRatio(this.xg + this.xo)

  // play note - use strength for volume, and user's cursor as
  // panning position
  this.playNote(this.rStrength, rPan)
  // start oscillation
  this.startOsc()
}

/**
 * Thread starts oscillating after being released.
 */
Thread.prototype.startOsc = function() {
  // where does the grabbed point want to return to
  this.xg1 = this.xp0 + this.rGrab * this.dx
  this.yg1 = this.yp0 + this.rGrab * this.dy
  // store start position
  this.xg0 = this.xg
  this.yg0 = this.yg
  // counter
  this.t = 0
  // we are on our first cycle of oscillation
  this.isFirstOsc = this.isOsc = true
}

/**
 * Play my note.
 * The member variables vol0 and vol1 to define actual volume range.
 * The member variables pan0 and pan1 to define actual panning range.
 * @param {number} rVol is a ratio 0 to 1 for volume. Uses
 * @param {number} rPan is a ratio -1 to 1 for left/right panning
 */
Thread.prototype.playNote = function(rVol, rPan) {
  // If i'm currently empty, don't play any note
  if (this.pitchInd == -1) return
  var pre = this.pitchInd < 10 ? '0' : ''
  // make sure sound has been loaded
  // if (!suite.soundReady) return;
  suite.playSound(
    this.pitchInd,
    VOLUME_MIN + rVol * (VOLUME_MAX - VOLUME_MIN),
    PAN_LEFT + rPan * (PAN_RIGHT - PAN_LEFT)
  )
}
