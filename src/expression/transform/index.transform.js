import { isArray, isBigNumber, isMatrix, isNumber, isRange } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'

const name = 'index'
const dependencies = ['Index', 'getMatrixDataType']

export const createIndexTransform = /* #__PURE__ */ factory(name, dependencies, ({ Index, getMatrixDataType }) => {
  /**
   * Attach a transform function to math.index
   * Adds a property transform containing the transform function.
   *
   * This transform creates a one-based index instead of a zero-based index
   */
  return function indexTransform () {
    const args = []
    for (let i = 0, ii = arguments.length; i < ii; i++) {
      let arg = arguments[i]

      // change from one-based to zero based, and convert BigNumber to number
      if (isRange(arg)) {
        arg.start--
        arg.end -= (arg.step > 0 ? 0 : 2)
      } else if (arg && arg.isSet === true) {
        arg = arg.map(function (v) { return v - 1 })
      } else if (isArray(arg) || isMatrix(arg)) {
        if (getMatrixDataType(arg) === 'boolean') {
          if (isArray(arg)) {
            arg = _boolToIndex(arg)
          } else if (isMatrix(arg)) {
            arg = _boolToIndex(arg.toArray())
          }
        } else {
          arg = arg.map(function (v) { return v - 1 })
        }
      } else if (isNumber(arg)) {
        arg--
      } else if (isBigNumber(arg)) {
        arg = arg.toNumber() - 1
      } else if (typeof arg === 'string') {
        // leave as is
      } else {
        throw new TypeError('Dimension must be an Array, Matrix, number, string, or Range')
      }

      args[i] = arg
    }

    function _boolToIndex (booleans) {
      // convert an array of booleans to index
      return booleans.map((_, i) => i).filter((_, i) => booleans[i])
    }

    const res = new Index()
    Index.apply(res, args)
    return res
  }
}, { isTransformFunction: true })
