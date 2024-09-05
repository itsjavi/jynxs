const hasOwnProperty = Object.prototype.hasOwnProperty

function is(x: any, y: any): boolean {
  if (typeof x !== typeof y) {
    return false
  }

  if (typeof x === 'number') {
    return isSameNumber(x, y)
  }

  return x === y
}

function isSameNumber(num1: number, num2: number) {
  return Math.abs(num1 - num2) < Number.EPSILON
}

// @see https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js
export function shallowEquals(objA: any, objB: any) {
  if (is(objA, objB)) {
    return true
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}
