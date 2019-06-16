/**
 * Common functions below
 */

/**
 * Linear interpolation
 * For example, a value of t = 0.5 would return halfway between
 * a and b.
 * @param {number} a is the first value.
 * @param {number} b is the second value.
 * @param {number} t is a ratio from 0 to 1.
 * @return {number} number in the range a to b, based on t.
 */
var lerp = function(a, b, t) {
  return a + (b - a) * t
}

/**
 * Limit a given number if it is outside of given range.
 * It will cap the value n if it outside of the limit, otherwise
 * it will just return n if it's within the acceptable range.
 * @param {number} n is the value we want to limit.
 * @param {number} n0 is the lower limit.
 * @param {number} n1 is the upper limit.
 * @return {number} a numer within the range n0 to n1.
 */
var lim = function(n, n0, n1) {
  if (n < n0) {
    return n0
  } else if (n >= n1) {
    return n1
  } else {
    return n
  }
}

/**
 * Takes a value as well as an upper and lower limit, and returns a
 * ratio 0 to 1, based on where that value sits. Assumes that
 * a >= a0 and a <= a1.
 * @param {number} a is the value.
 * @param {number} a0 is the lower limit.
 * @param {number} a1 is the upper limit.
 * @return {number} A ratio 0 to 1.
 */
var norm = function(a, a0, a1) {
  return (a - a0) / (a1 - a0)
}

/**
 * Takes a value and returns -1 or 1 if it's positive or negative
 * @param {number} n is the value.
 * @return {number} -1 if the value is negative, 1 if it's positive
 */
var sign = function(n) {
  if (n >= 0) {
    return 1
  } else {
    return -1
  }
}

/**
 * Linear interpolate between two colors, each as RGBA array.
 * @param {array} a First RGBA array color.
 * @param {array} b Second RGBA array color.
 * @param {number} t ratio 0 to 1.
 * @return {array} interpolated value.
 */
var lerpColor = function(a, b, t) {
  var c1 = lerp(a[0], b[0], t)
  var c2 = lerp(a[1], b[1], t)
  var c3 = lerp(a[2], b[2], t)
  var c4 = lerp(a[3], b[3], t)
  return [c1, c2, c3, c4]
}

/**
 * Takes rgb(#,#,#) or rgba(#,#,#) and return hex string.
 * @param color is rgb(#,#,#) or rgba(#,#,#).
 * @return corresponding hex value.
 */
function rgbToHex(color) {
  var m = /rgba?\((\d+), (\d+), (\d+)/.exec(c)
  return m ? '#' + ((m[1] << 16) | (m[2] << 8) | m[3]).toString(16) : c
}

/**
 * Convert a hex value to its decimal value.
 * @param {hex} hex value to convert.
 * @return {array} array with three values.
 */
function hex2rgb(hex) {
  // Remove the '#' char - if there is one.
  if (hex.charAt(0) == '#') hex = hex.slice(1)
  hex = hex.toUpperCase()
  var hex_alphabets = '0123456789ABCDEF'
  var value = new Array(3)
  var k = 0
  var int1, int2
  for (var i = 0; i < 6; i += 2) {
    int1 = hex_alphabets.indexOf(hex.charAt(i))
    int2 = hex_alphabets.indexOf(hex.charAt(i + 1))
    value[k] = int1 * 16 + int2
    k++
  }
  return value
}

/**
 * Takes an array of three colors as RGB values and converts to
 * a string rgb(#,#,#)'
 * @param {Array} Array of three numbers
 * @return rgb value.
 */
var getRgb = function(color) {
  var r = Math.round(color[0])
  var g = Math.round(color[1])
  var b = Math.round(color[2])
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

/**
 * Calculates line segment intersection AB and EF.
 * Takes four {@link #Point} instances and returns a {@link #Point}
 * instance (or null if they do not intersect)
 * @param {Object} A Point object, start of first segment.
 * @param {Object} B Point object, end of first segment.
 * @param {Object} E Point object, start of second segment.
 * @param {Object} E Point object, end of second segment.
 * @return {Object} Point of intersection, or null if no intersection
 */
var lineIntersect = function(A, B, E, F) {
  var ip, a1, a2, b1, b2, c1, c2
  // calculate
  a1 = B.y - A.y
  a2 = F.y - E.y
  b1 = A.x - B.x
  b2 = E.x - F.x
  c1 = B.x * A.y - A.x * B.y
  c2 = F.x * E.y - E.x * F.y
  // det
  var det = a1 * b2 - a2 * b1
  // if lines are parallel
  if (det == 0) {
    return null
  }
  // find point of intersection
  var xip = (b1 * c2 - b2 * c1) / det
  var yip = (a2 * c1 - a1 * c2) / det
  // now check if that point is actually on both line
  // segments using distance
  if (
    Math.pow(xip - B.x, 2) + Math.pow(yip - B.y, 2) >
    Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)
  ) {
    return null
  }
  if (
    Math.pow(xip - A.x, 2) + Math.pow(yip - A.y, 2) >
    Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)
  ) {
    return null
  }
  if (
    Math.pow(xip - F.x, 2) + Math.pow(yip - F.y, 2) >
    Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)
  ) {
    return null
  }
  if (
    Math.pow(xip - E.x, 2) + Math.pow(yip - E.y, 2) >
    Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)
  ) {
    return null
  }
  // else it's on both segments, return it
  return new Point(xip, yip)
}

/**
 * A simple point object that stores x as x coordinate, y as y coordinate.
 * @class This is the Point class.
 * @constructor
 * @param {number} px x coordinate for the point.
 * @param {number} px y coordinate for the point.
 */
var Point = function(px, py) {
  this.x = px
  this.y = py
}

/**
 * Update the x coordinate of the point.
 * @param {number} px x coordinate for the point.
 */
Point.prototype.setX = function(px) {
  this.x = px
}

/**
 * Update the y coordinate of the point.
 * @param {number} py y coordinate for the point.
 */
Point.prototype.setY = function(py) {
  this.y = py
}
