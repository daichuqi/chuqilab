import { MATH_PI } from './configs'

export default class Wheel {
  constructor(xpPm, ypPm, indPm, cvPm, suite) {
    this.suite = suite
    // my index number (0 or 1)
    this.ind = indPm
    // set my center position
    this.xp = xpPm
    this.yp = ypPm
    // Set initial rotation (radians).
    this.setRot(MATH_PI * 0.25)
    // Rotational speed (radians/frame).
    var sgn = this.ind == 0 ? 1 : -1
    this.rotSpd = sgn * 0.035
    this.cv = cvPm

    this.init()
  }

  init = () => {
    this.m = this.suite.machine
  }

  upd = () => {
    this.sinAng = Math.sin(this.rot)
    this.cosAng = Math.cos(this.rot)
    // Update my nubs.
    this.nub0.upd()
    this.nub1.upd()
  }

  redraw = () => {
    // Update my nubs.
    this.nub0.redraw()
    this.nub1.redraw()
  }

  setRot = r => {
    this.rot = r
  }
}
