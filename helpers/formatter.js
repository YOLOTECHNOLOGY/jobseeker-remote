export const numberToThousands = (number) => {
  if (number <= 0) {
    return 0
  } else {
    return Math.floor(number / 1000)
  }
}

export const unslugify = (string, capitalize = false) => {
  if (string) {
    if (!capitalize) {
      return string.split('-').join(' ')
    }
    const strings = string.split('-')
    strings.map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    return strings.join(' ')
  }
}

export const unslugifyTwo = (string) => {
  return string.split('-').join('_').toLowerCase()
}

export const thousandsToNumber = (string) => {
  if (string !== 'Above 100K') {
    const number = parseInt(string.split('K')[0], 10)
    return number * 1000
  } else {
    return 100001
  }
}

export const roundHalf = (number) => {
  /* round the number to the nearest 0.5 or 0 */
  return Math.floor(number * 2) / 2
}

export const encodeListForURL = (list) => {
  const reducer = (accumulator, currentValue) =>
    accumulator + '-' + encodeURIComponent(currentValue)
  return list.reduce(reducer, '').substr(1)
}

export const formatSalaryWithComma = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// transform first letter of every word into uppercase
export const titleCase = (x) => {
  if (!x) return ''
  return x
    .toLowerCase()
    .replace(/./, (x) => x.toUpperCase())
    .replace(/[^']\b\w/g, (y) => y.toUpperCase())
}

// unescape allowed html tag in chat
export const toChatHTML = (x) => {
  return x
    .replace(/&lt;b&gt;/g, '<b>')
    .replace(/&lt;\/b&gt;/g, '</b>')
    .replace(/&lt;i&gt;/g, '<i>')
    .replace(/&lt;\/i&gt;/g, '</i>')
    .replace(/&lt;u&gt;/g, '<u>')
    .replace(/&lt;\/u&gt;/g, '</u>')
    .replace(/&lt;p&gt;/g, '<p>')
    .replace(/&lt;\/p&gt;/g, '</p>')
    .replace(/&lt;br&gt;/g, '<br/>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;nbsp;/gi, ' ')
    .replace(
      // eslint-disable-next-line
      /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,
      '<a style="text-decoration: underline; color: #0000ff" target="_blank" href="$1">$1</a>'
    )
}

// espace html tag
export const escapeChatHtml = (x) => {
  return x
    .replace(/<b>/g, '')
    .replace(/<\/b>/g, '')
    .replace(/<i>/g, '')
    .replace(/<\/i>/g, '<')
    .replace(/<u>/g, '')
    .replace(/<\/u>/g, '')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<br\/>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/&amp;nbsp;/gi, '')
  // .replace(
  //   // eslint-disable-next-line
  //   /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,
  //   '<a style="text-decoration: underline; color: #0000ff" target="_blank" href="$1">$1</a>'
  // )
}

// custom empty line remover
export const htmlTrim = (x) => {
  let y = x
  const PATTERN = '<p><br></p>'

  while (y.trim().startsWith(PATTERN)) {
    y = y.trim().slice(PATTERN.length, y.length)
  }

  while (y.trim().endsWith(PATTERN)) {
    y = y.trim().slice(0, -PATTERN.length)
  }

  return y.trim()
}

export const flat = (arrayToBeFlattened) => Array.prototype.concat.apply([], arrayToBeFlattened)

export const truncateWords = (words, maxLen) => {
  if (words.length <= maxLen) return words
  return words.substr(0, maxLen) + '...'
}

export const numberWithCommas = (number) => {
  return `₱${number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export const formatSalary = (salary) => {
  if (salary) {
    return `₱${parseInt(salary).toLocaleString()}`
  }
}

export const removeEmptyOrNullValues = (object) => {
  let newObject = {}
  Object.entries(object).forEach(
    ([key, value]) => { if (value) Object.assign(newObject, {[key]: value}) }
  )

  return newObject
}