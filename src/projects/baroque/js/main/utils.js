import Point from './point'

export const hex2rgb = hex => {
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
 * Takes a value and returns -1 or 1 if it's positive or negative
 * @param {number} n is the value.
 * @return {number} -1 if the value is negative, 1 if it's positive
 */
export const sign = n => {
  if (n >= 0) {
    return 1
  } else {
    return -1
  }
}

/**
 * Linear interpolation
 * For example, a value of t = 0.5 would return halfway between
 * a and b.
 * @param {number} a is the first value.
 * @param {number} b is the second value.
 * @param {number} t is a ratio from 0 to 1.
 * @return {number} number in the range a to b, based on t.
 */
export const lerp = (a, b, t) => {
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
export const lim = (n, n0, n1) => {
  if (n < n0) {
    return n0
  } else if (n >= n1) {
    return n1
  } else {
    return n
  }
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
export const lineIntersect = (A, B, E, F) => {
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
