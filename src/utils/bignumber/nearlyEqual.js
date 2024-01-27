import { DBL_EPSILON } from '../number.js'
/**
 * Compares two BigNumbers.
 * @param {BigNumber} x       First value to compare
 * @param {BigNumber} y       Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
 */
export function nearlyEqual (x, y, rtol, atol) {
  const epsilon = DBL_EPSILON
  const absTol = (atol > 0) ? atol : 0
  const relTol = (rtol >= 0) ? rtol : (atol > 0) ? Math.sqrt(epsilon) : 0

  // use "==" operator, handles infinities
  if (x.eq(y)) {
    return true
  }

  // NaN
  if (x.isNaN() || y.isNaN()) {
    return false
  }

  // at this point x and y should be finite
  if (x.isFinite() && y.isFinite()) {
    // check numbers are very close, needed when comparing numbers near zero
    return x.sub(y).abs().lte(x.constructor.max(absTol, relTol * x.constructor.max(x.abs(), y.abs())))
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false
}
