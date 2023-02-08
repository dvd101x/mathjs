import { factory } from '../../../utils/factory.js'

const name = 'broadcast'

const dependancies = ['typed', 'concat']

export const createBroadcast = /* #__PURE__ */ factory(
  name, dependancies,
  ({ typed, concat }) => {
    /**
   * Broadcasts two matrices, and return both in an array
   * It checks if it's possible with broadcasting rules
   *
   * @param {Matrix}   A      First Matrix
   * @param {Matrix}   B      Second Matrix
   *
   * @return {Matrix[]}      [ broadcastedA, broadcastedB ]
   */
    return typed(name, {
      'Matrix, Matrix': (A, B) => {
        let sizeA
        let sizeB
        const N = Math.max(A._size.length, B._size.length) // max number of dims

        A._size.length < N
          ? sizeA = [...Array(N - A._size.length).fill(0), ...A._size]
          : sizeA = [...A._size] // clone

        B._size.length < N
          ? sizeB = [...Array(N - B._size.length).fill(0), ...B._size]
          : sizeB = [...B._size] // clone

        const sizeMax = []

        for (let dim = 0; dim < N; dim++) {
          sizeMax[dim] = Math.max(sizeA[dim], sizeB[dim])
        }

        for (let dim = 0; dim < N; dim++) {
          if ((sizeA[dim] < sizeMax[dim]) & (sizeA[dim] > 1)) { throw new Error(`shape missmatch: missmatch is found in arg with shape (${sizeA}) not possible to broadcast dimension ${dim} with size ${sizeA[dim]} to size ${sizeMax[dim]}`) }
          if ((sizeB[dim] < sizeMax[dim]) & (sizeB[dim] > 1)) { throw new Error(`shape missmatch: missmatch is found in arg with shape (${sizeB}) not possible to broadcast dimension ${dim} with size ${sizeB[dim]} to size ${sizeMax[dim]}`) }
        }

        if (A._size.length < N) { A.reshape([...Array(N - A._size.length).fill(1), ...A._size]) } else if (B._size.length < N) { B.reshape([...Array(N - B._size.length).fill(1), ...B._size]) }

        for (let dim = 0; dim < N; dim++) {
          if (A._size[dim] < sizeMax[dim]) { A = concat(...Array(sizeMax[dim]).fill(A), dim) }
          if (B._size[dim] < sizeMax[dim]) { B = concat(...Array(sizeMax[dim]).fill(B), dim) }
        }
        return [A, B]
      }
    })
  }
)
