/**
 * @fileoverview This file contains the Wheel class.
 * @author Alexander Chen alex@chenalexander.com
 * @version 0.1
 */

/**
 * Builds a new Wheel.
 * @class This is the Wheel class.
 * @constructor
 * @param
 */
var Wheel = function(xpPm, ypPm, indPm, cvPm) {
  // my index number (0 or 1)
  this.ind = indPm
  // set my center position
  this.xp = xpPm
  this.yp = ypPm
  // Set initial rotation (radians).
  //if (this.ind == 1) { this.setRot(MATH_PI*0.25); } else { this.setRot(MATH_PI*0.25); }
  this.setRot(MATH_PI * 0.25)
  // Rotational speed (radians/frame).
  var sgn = this.ind == 0 ? 1 : -1
  this.rotSpd = sgn * 0.035
  this.cv = cvPm

  this.init()
}

/**
 * Initialize.
 */
Wheel.prototype.init = function() {
  // link to main
  this.m = suite.machine
}

/**
 * Update function.
 */
Wheel.prototype.upd = function() {
  this.sinAng = Math.sin(this.rot)
  this.cosAng = Math.cos(this.rot)
  // Update my nubs.
  this.nub0.upd()
  this.nub1.upd()
}

/**
 * Redraw function.
 */
Wheel.prototype.redraw = function() {
  // Update my nubs.
  this.nub0.redraw()
  this.nub1.redraw()
}

/**
 * Set rotation.
 */
Wheel.prototype.setRot = function(r) {
  this.rot = r
}
