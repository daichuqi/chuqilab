import Point from './point'

import { WHEEL_RADIUS, MATH_PI, SPD_IGNORE_MAX, SPD_GRAB, NUBS } from './configs'
import { lineIntersect, lerp } from './utils'

/**
 * Constants definition.
 */

// Radius to draw circle.
const RAD_NORM = 6
// Radius of circle when user is rolled over
const RAD_OVER = 15
// My radius while grabbed
const RAD_GRAB = 10
// radius easing ratio 0 to 1
const RAD_EASE = 0.4
// Ease towards orbit when grabbed
const EASE_ORBIT_GRAB = 0.2
// Ease towards new orbit when follower
const EASE_ORBIT_FOLLOW = 0.02
// Ease towards orbit when released, going back to wheel
const EASE_ORBIT_RESTORE = 0.02
// Ease towards new orbit center when grabbed
const EASE_CENTER_GRAB = 0.3
// Ease center position when released, going back to wheel
const EASE_CENTER_RESTORE = 0.015
// Ease towards new orbit center when following
const EASE_CENTER_FOLLOW_MIN = 0.04
const EASE_CENTER_FOLLOW_MAX = 0.01
// Ease towards new orbit size and position while a loader
const EASE_ORBIT_LOADER = 0.003
const EASE_CENTER_LOADER = 0.03
//
const EASE_ORBIT_EXIT_LOADER = 0.1 // Make it go back really fast
const EASE_CENTER_EXIT_LOADER = 0.1 // Make it go back really fast

// Trail start and end opacity
const TRAIL_OPAC_MIN = 0.04
const TRAIL_OPAC_MAX = 0.5
// At what point along the trail (0 to 1) do we start fading back out
const TRAIL_FADEOUT = 0.6
// How many past points to store for trail?
const TRAIL_PTS = 24
// Sample rate for trails (don't need to update every frame)
const TRAIL_SAMPLE = 4
// Radius of how close user needs to be to rollover a nub
// Make this squared, so we don't have to do sqrt for distance.
// e.g. For distance radius of 10, set this to 100.
const ROLLOVER_RAD_SQ = 3500
// How many strings can we pluck in one frame
const PLUCK_FRAME_MAX = 2
// Orbit when I am a follower
const ORBIT_FOLLOW_MIN = WHEEL_RADIUS * 0.3
const ORBIT_FOLLOW_MAX = WHEEL_RADIUS * 0.5
// Orbit if I am the preloader nub
const ORBIT_LOADER = 35
// Orbit when I am being dragged
const ORBIT_GRAB = 15
// Cap speed after user releases. Give it max speed so it can't fly off
// Also give minimum so it has a little delay when released
const THROW_SPD_MAX = 23
const THROW_SPD_MIN = 6

/**
 * Builds a new Nub.
 * @class This is the Nub class.
 * @constructor
 * @param
 */
var Nub = function(indPm, indAllPm, machinePm, wheelPm, cvPm) {
  // Store my actual current and previous position.
  this.xp0
  this.yp0
  this.xp1
  this.yp1
  // Store the position that we would want to be at on the wheel
  this.xpw
  this.ypw
  // as point objects
  this.pt0 = new Point()
  this.pt1 = new Point()
  // link to my wheel
  this.wheel = wheelPm

  this.machine = machinePm
  // My index 0 or 1 within wheel.
  this.ind = indPm
  // My index 0, 1, 2, 3 within overall.
  this.indAll = indAllPm
  // Canvas object.
  this.cv = cvPm
  // The current center of my orbit and target
  this.xpOrbit = this.xpOrbitTarg = this.wheel.xp
  this.ypOrbit = this.ypOrbitTarg = this.wheel.yp
  // My current and target orbit (radius)
  this.orbit = this.orbitTarg = WHEEL_RADIUS
  // My current radius
  this.rad = RAD_NORM
  // My target radius
  this.radTarg = RAD_NORM
  // My current scale, 0 (small size) to 1 (rollover size)
  this.scaleRat = 0
  // velocity
  this.velX = 0
  this.velY = 0
  // dampen velocity with this friction
  this.dampVel = 0.93
  // Array of past points nub has traveled.
  this.arrTrail = new Array(TRAIL_PTS)
  // General frame counter - start at different point to offset when we'll update trails
  this.frameCt = this.indAll
  // Current speed.
  this.spd = 0
  // Is mouse rolled over me.
  this.isMouseOver = false
  // Is mouse holding me
  this.isGrabbed = false
  // Am I currently in follow mode
  this.isFollowing = false
  // First time running?
  this.isFirstRun = true
  // Have I entered yet, or still in waiting mode?
  this.hasEntered = false
  // Am I in loading mode?
  this.isLoading = false
  // When I am just tossed, as it is recovering to a halt.
  this.isTossing = false
  this.init()
}

Nub.prototype.init = function() {
  this.m = this.machine
}

/**
 * Update function.
 */
Nub.prototype.upd = function() {
  // If we're still loading and it's not the loader clip, don't do it
  if (!this.hasEntered) return
  this.updPos()
  this.updInteract()
}

/**
 * Update function.
 */
Nub.prototype.updInteract = function() {
  // set my position based on wheel's rotation
  // don't do it on the first run
  if (this.isFirstRun) {
    this.isFirstRun = false
    return
  }
  // Don't do it if we skipped too far (this happens on loop around)
  if (this.spd > SPD_IGNORE_MAX) return
  //
  var xi
  var yi
  var th
  var ctPluck = 0

  // go through threads
  for (var i = 0; i < this.m.arrThreads.length; i++) {
    th = this.m.arrThreads[i]
    // find line intersection
    var pt = lineIntersect(this.pt0, this.pt1, th.pt0, th.pt1)
    // did we get a point?
    if (pt == null) continue
    xi = pt.x
    yi = pt.y
    // if it's not already grabbed, grab it
    if (!th.isGrabbed && !isNaN(xi) && !isNaN(yi)) {
      if (this.spd > SPD_GRAB) {
        // brush over thread
        th.pluck(xi, yi, true, this)
        // Grabbed too many?
        ctPluck++
        if (ctPluck > PLUCK_FRAME_MAX) break
      } else {
        // brush over thread
        th.grab(xi, yi, true, this)
        break
      }
      // if user is holding it, NEED TO DROP IT -
      // if (th.isGrabbed) th.drop();
    }
  }
}

/**
 * Update loop run every frame, triggered by #upd.
 */
Nub.prototype.updPos = function() {
  // Now update the speed of my travel.
  // how much time has elapsed since last update?
  var d = new Date()
  this.t1 = d.getTime() / 1000
  var elap = this.t1 - this.t0
  this.t0 = this.t1

  // dampen velocity
  this.velX *= this.dampVel
  this.velY *= this.dampVel
  if (Math.abs(this.velX) < 0.5) this.velX = 0
  if (Math.abs(this.velY) < 0.5) this.velY = 0
  // Where would we go if it was purely on velocity?
  this.xpv = this.xp0 + this.velX
  this.ypv = this.yp0 + this.velY

  // Update size of the dot.
  if (this.rad != this.radTarg) {
    var dr = this.radTarg - this.rad
    if (Math.abs(dr) < 1) {
      this.rad = this.radTarg
    } else {
      this.rad += dr * RAD_EASE
    }
  }

  // Set the actual position.
  if (Math.abs(this.velX) > 0 || Math.abs(this.velY) > 0) this.isTossing = true
  else this.isTossing = false

  // While we are in tossing mode, just set it based on velocity
  if (this.isTossing) {
    this.setPos(this.xpv, this.ypv)
    this.xpOrbit = this.xpv
    this.ypOrbit = this.ypv
    this.orbit = 0

    // Otherwise, we want to use the wheel position, orbiting mode
  } else {
    // If user is holding a nub
    if (this.machine.isHoldingNub) {
      // Ease towards user position.
      this.xpOrbitTarg = this.m.getUserX()
      this.ypOrbitTarg = this.m.getUserY()
    } else if (this.isMouseOver) {
      this.xpOrbitTarg = this.m.getUserX()
      this.ypOrbitTarg = this.m.getUserY()
      // Else user is not holding a nub,  use wheel anchor positions as target
    } else if (!this.isLoading) {
      // Target position for orbit
      this.xpOrbitTarg = this.wheel.xp
      this.ypOrbitTarg = this.wheel.yp
    } else {
      // Else it's the loader nub. Don't need to set orbit position every frame.
      // TEMPORARY! seeing if it works
      this.xpOrbitTarg = this.wheel.xp
      this.ypOrbitTarg = this.wheel.yp
    }

    // Ease towards new orbit radius
    // If we're moused over, overwrite it with a zero value orbit
    var orbitTargTrue = this.isMouseOver ? 0 : this.orbitTarg
    if (this.orbit != orbitTargTrue) {
      this.orbit += (orbitTargTrue - this.orbit) * this.easeOrbit
      if (Math.abs(this.orbitTarg - this.orbit) < 1) this.orbit = this.orbitTarg // Close enough?
    }
    // Ease x towards orbit center
    if (this.xpOrbit != this.xpOrbitTarg) {
      this.xpOrbit += (this.xpOrbitTarg - this.xpOrbit) * this.easeCenter
      if (Math.abs(this.xpOrbitTarg - this.xpOrbit) < 1) this.xpOrbit = this.xpOrbitTarg // Close enough?
    }
    // Ease y towards orbit center
    if (this.ypOrbit != this.ypOrbitTarg) {
      this.ypOrbit += (this.ypOrbitTarg - this.ypOrbit) * this.easeCenter
      if (Math.abs(this.ypOrbitTarg - this.ypOrbit) < 1) this.ypOrbit = this.ypOrbitTarg // Close enough?
    }

    // Set new positions of nubs based on wheel rotation
    if (this.ind == 0) {
      this.xpw = this.xpOrbit + this.wheel.cosAng * this.orbit
      this.ypw = this.ypOrbit + this.wheel.sinAng * this.orbit
    } else {
      this.xpw = this.xpOrbit - this.wheel.cosAng * this.orbit
      this.ypw = this.ypOrbit - this.wheel.sinAng * this.orbit
    }

    // First time running, initialize position to the wheel position
    if (this.isFirstRun) {
      // this.isFirstRun = false; (It sets isFirstrun to false in updInteract)
      this.xp0 = this.xp1 = this.xpw
      this.yp0 = this.yp1 = this.ypw
      // Initialize trail array.
      for (var i = 0; i < TRAIL_PTS; i++) {
        this.arrTrail[i] = new Point(this.xpw, this.ypw)
      }
    }
    // set it
    this.setPos(this.xpw, this.ypw)
  }

  // change in position
  this.dx = this.xp1 - this.xp0
  this.dy = this.yp1 - this.yp0
  // update point objects
  this.pt0.x = this.xp0
  this.pt0.y = this.yp0
  this.pt1.x = this.xp1
  this.pt1.y = this.yp1
  // increment
  this.xp0 = this.xp1
  this.yp0 = this.yp1
  // how far did we go in this frame
  this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
  // store that as my speed, how many px i'm going in this frame
  //this.spd = this.dist/elap;
  this.spd = this.dist
  // Take sample point for trail.
  if (this.frameCt % TRAIL_SAMPLE == 0) {
    this.arrTrail.shift()
    this.arrTrail[TRAIL_PTS - 1] = new Point(this.xp0, this.yp0)
  }
  // Check all points in my trail against bounding box
  for (var i = 0; i < this.arrTrail.length; i++) {
    this.m.checkBoxLimit(this.arrTrail[i].x, this.arrTrail[i].y)
  }
  this.frameCt++
}

/**
 * Set me as the loading nub.
 */
Nub.prototype.enter = function() {
  this.hasEntered = true
  this.isLoading = true

  // enters first
  if (this.indAll == 0) {
    this.xpOrbit = -150
    this.ypOrbit = this.m.height * 0.6
    this.orbit = ORBIT_LOADER * 0.3
    // enters third
  } else if (this.indAll == 1) {
    this.xpOrbit = this.m.width * 1.0
    this.ypOrbit = -this.m.height * 0.9
    this.orbit = ORBIT_LOADER * 5.5
    // enter second
  } else if (this.indAll == 2) {
    this.xpOrbit = -this.m.width * 1.5
    this.ypOrbit = this.m.height * 1.0
    this.orbit = ORBIT_LOADER * 6
    // enters last
  } else if (this.indAll == 3) {
    this.xpOrbit = this.m.width * 1.2
    this.ypOrbit = -this.m.height * 0.8
    this.orbit = ORBIT_LOADER * 1.5
  }
  // Set target center position
  // this.xpOrbitTarg = 0;
  //this.ypOrbitTarg = this.ypOrbit = this.machine.arrThreads[this.indAll*2+1].yp1;
  //
  this.radTarg = RAD_NORM // Set new target radius size

  // TEMPORARY! To see if it's seamless.
  this.orbitTarg = WHEEL_RADIUS
  this.easeOrbit = EASE_ORBIT_LOADER // Make it go back really fast
  this.easeCenter = EASE_CENTER_LOADER // Make it go back really fast
  this.radTarg = RAD_NORM
}

/**
 * Release me from loading mode
 */
Nub.prototype.exitLoader = function() {
  this.isLoading = false
  this.orbitTarg = WHEEL_RADIUS

  this.easeOrbit = EASE_ORBIT_EXIT_LOADER // Make it go back really fast
  this.easeCenter = EASE_CENTER_EXIT_LOADER // Make it go back really fast
  this.radTarg = RAD_NORM
}

/**
 * Roll over.
 */
Nub.prototype.rollOver = function() {
  this.isMouseOver = true
  this.radTarg = RAD_OVER // Set new target radius
}

/**
 * Roll out.
 */
Nub.prototype.rollOut = function() {
  this.isMouseOver = false
  this.radTarg = RAD_NORM // Set new target radius
}

/**
 * Grab this nub.
 */
Nub.prototype.grab = function() {
  this.velX = this.velY = 0 // Snap velocity to zero when grabbed.

  this.easeOrbit = EASE_ORBIT_GRAB
  this.easeCenter = EASE_CENTER_GRAB

  this.isGrabbed = true
  this.radTarg = RAD_GRAB // Set new target radius size
  this.orbitTarg = ORBIT_GRAB // Set new target orbit size

  // Start at random point
  var ind = Math.floor(Math.random() * NUBS)
  if (ind == NUBS) ind = NUBS - 1
  // Initialize the followers
  for (var i = 0; i < NUBS; i++) {
    var n = this.machine.arrNubs[ind]
    if (n != this) {
      n.follow(i)
    }
    ind = (ind + 1) % NUBS
  }
}

/**
 * Release this nub.
 */
Nub.prototype.drop = function() {
  this.isGrabbed = false
  this.orbitTarg = WHEEL_RADIUS

  this.easeOrbit = EASE_ORBIT_RESTORE
  this.easeCenter = EASE_CENTER_RESTORE
  this.radTarg = RAD_NORM

  // store velocity as the difference of the last two points
  this.velX = this.m.dx
  this.velY = this.m.dy
  var vxa = Math.abs(this.velX)
  var vya = Math.abs(this.velY)

  // Limit it to minimum and maximum
  if (vxa > THROW_SPD_MAX) {
    this.velX = (vxa / this.velX) * THROW_SPD_MAX
  } else if (vxa < THROW_SPD_MIN) {
    // Since user wasn't moving, need to use our own dx.
    if (this.dx == 0) this.velX = (Math.random() > 0.5 ? -1 : 1) * THROW_SPD_MIN
    // don't divide by zero
    else this.velX = (Math.abs(this.dx) / this.dx) * THROW_SPD_MIN
  }

  if (vya > THROW_SPD_MAX) {
    this.velY = (vya / this.velY) * THROW_SPD_MAX
  } else if (vya < THROW_SPD_MIN) {
    // Since user wasn't moving, need to use our own dx.
    if (this.dy == 0) this.velY = (Math.random() > 0.5 ? -1 : 1) * THROW_SPD_MIN
    // don't divide by zero
    else this.velY = (Math.abs(this.dy) / this.dy) * THROW_SPD_MIN
  }

  var spd = Math.sqrt(vxa * vxa + vya * vya)
  // tell the followers to stop following
  var ct = 1
  var nub
  for (var i = 0; i < NUBS; i++) {
    nub = this.machine.arrNubs[i]
    if (nub != this && nub.hasEntered) nub.unfollow(this, this.velX, this.velY, ct / NUBS)
    ct++
  }
}

/**
 * This nub starts following.
 */
Nub.prototype.follow = function(indPm) {
  var r = indPm / (NUBS - 1)
  this.orbitTarg = lerp(ORBIT_FOLLOW_MIN, ORBIT_FOLLOW_MAX, r)
  this.easeCenterFollow = lerp(EASE_CENTER_FOLLOW_MIN, EASE_CENTER_FOLLOW_MAX, r)

  this.easeOrbit = EASE_ORBIT_FOLLOW
  this.easeCenter = this.easeCenterFollow
}

/**
 * This nub ceases following.
 */
Nub.prototype.unfollow = function(nubSource, vx, vy, damp) {
  // Make it half use the source node's velocity, and half steer the direction towards the source node.
  var dx = nubSource.xp1 - this.xp1
  var dy = nubSource.yp1 - this.yp1
  //
  var r = 0.05 // How much to steer towards the source node (0 to 1)
  this.velX = (dx * r + vx * (1 - r)) * damp
  this.velY = (dy * r + vy * (1 - r)) * damp
  this.orbitTarg = WHEEL_RADIUS
  this.easeOrbit = EASE_ORBIT_RESTORE
  this.easeCenter = EASE_CENTER_RESTORE
}

/**
 * Check mouse over.
 */
Nub.prototype.checkMouseOver = function() {
  // If mouse is already rolled over another nub, don't bother.
  var dx = this.m.getUserX() - this.xp1
  var dy = this.m.getUserY() - this.yp1
  var distSq = dx * dx + dy * dy
  return distSq < ROLLOVER_RAD_SQ
}

/**
 * Run on the first run when we return from the background
 */
Nub.prototype.returnFromBackground = function() {
  // Initialize trail array.
  for (var i = 0; i < TRAIL_PTS; i++) {
    this.arrTrail[i] = new Point(this.xp0, this.yp0)
  }
}

/**
 * Redraw function.
 */
Nub.prototype.redraw = function() {
  // If we're still loading and it's not the loader clip, don't do it
  if (!this.hasEntered) return

  this.cv.beginPath()
  this.cv.fillStyle = '#FFFFFF'
  this.cv.arc(this.xp1 + this.m.xo, this.yp1 + this.m.yo, this.rad, 0, 2 * MATH_PI)
  this.cv.fill()
  this.cv.closePath()

  var x0, y0, x1, y1, x2, y2, xh0, yh0, xh1, yh1, opac, rat

  // if we're in the background, don't even draw the trail
  if (this.machine.isInBackground) return

  x0 = this.arrTrail[0].x
  y0 = this.arrTrail[0].y
  x1 = this.arrTrail[1].x
  y1 = this.arrTrail[1].y

  // How close to the nub do we want to get? - should be TRAIL_PTS-1 or lower.
  var TRAIL_PTS_LIM = TRAIL_PTS - 2
  // draw trail
  for (var i = 1; i < TRAIL_PTS_LIM; i++) {
    // Ratio 0 to 1 along the trail
    rat = (i - 1) / (TRAIL_PTS_LIM - 2)
    // Our current point.
    x2 = this.arrTrail[i].x
    y2 = this.arrTrail[i].y

    // Calculate first halfway point
    xh0 = x0 + (x1 - x0) * 0.5
    yh0 = y0 + (y1 - y0) * 0.5
    // If it's the second point, just break here.
    if (i == 1) continue
    // Else calculate next halfway point
    xh1 = x1 + (x2 - x1) * 0.5
    yh1 = y1 + (y2 - y1) * 0.5
    //
    this.cv.beginPath()
    this.cv.lineWidth = 1
    // calculate opacity.
    if (rat < TRAIL_FADEOUT) {
      opac = lerp(TRAIL_OPAC_MIN, TRAIL_OPAC_MAX, rat / TRAIL_FADEOUT)
    } else {
      opac = lerp(TRAIL_OPAC_MAX, TRAIL_OPAC_MIN, (rat - TRAIL_FADEOUT) / (1 - TRAIL_FADEOUT))
    }
    this.cv.strokeStyle = `rgba(255,255,255, ${opac})`
    this.cv.moveTo(this.m.xo + xh0, this.m.yo + yh0)
    this.cv.quadraticCurveTo(
      this.m.xo + x1,
      this.m.yo + y1, // First control point
      this.m.xo + xh1,
      this.m.yo + yh1 // End anchor point
    )
    // increment points
    x0 = x1
    y0 = y1
    x1 = x2
    y1 = y2
    //
    this.cv.stroke()
    this.cv.closePath()
  }
}

/**
 * Update function.
 */
Nub.prototype.setPos = function(x, y) {
  this.xp1 = x
  this.yp1 = y
}

export default Nub
