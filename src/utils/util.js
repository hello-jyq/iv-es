
export function objectKeyIsEmpty(obj) {
  let empty = false
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === null || obj[key] === '') {
        empty = true
        break
      }
    }
  }
  return empty
}

