/* eslint-disable */
Array.prototype.contains = function(needle) {
  for (const item in this) {
    if (this[item] === needle) return true
  }
  return false
}
