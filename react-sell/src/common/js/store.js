export function saveToLocal (key, value) {
  // 存储到本地localStorage
  let seller = {}
  seller[key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal (key) {
  // 读
  if (!window.localStorage.__seller__) {return false}
  let seller = window.localStorage.__seller__
  seller = JSON.parse(seller)
  let ret = seller[key]
  return ret
}