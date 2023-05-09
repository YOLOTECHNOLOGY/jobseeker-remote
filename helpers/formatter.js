import moment from 'moment'
import { escapeRegExp } from 'lodash-es'

export const numberToThousands = (number) => {
  if (number <= 0) {
    return 0
  } else {
    return Math.floor(number / 1000)
  }
}

export const unslugify = (string, capitalize = false) => {
  if (typeof string !== 'string') {
    return string
  }
  if (string) {
    if (!capitalize) {
      return string.split?.('-')?.join(' ')
    }
    let strings = string?.split?.('-')
    strings = strings.map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    return strings.join(' ')
  }
}

export const unslugifyTwo = (string) => {
  return string.split?.('-')?.join('_')?.toLowerCase?.()
}

export const thousandsToNumber = (string) => {
  if (string !== 'Above 100K') {
    const number = parseInt(string?.split?.('K')?.[0], 10)
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

export const formatSalaryRange = (salaryRange, currencyTag) => {
  if (salaryRange) {
    const salArr = salaryRange.split('-')
    salArr.map(
      (val, i) =>
        (salArr[i] = `${currencyTag || '₱'}${val.trim() / 1000}${formatDecimalSalary(val.trim())}`)
    )
    return salArr.join(' - ')
  }

  return '-'
}

export const formatDecimalSalary = (salary) => {
  const value = Math.floor(salary.slice(-3) / 100)
  return Number(value) > 0 ? `.${value}K` : 'K'
}

export const formatSalary = (salary) => {
  if (salary) {
    return `₱${parseInt(salary).toLocaleString()}`
  }
}

export const removeEmptyOrNullValues = (object) => {
  const newObject = {}
  Object.entries(object).forEach(([key, value]) => {
    if (value) Object.assign(newObject, { [key]: value })
  })

  return newObject
}

export const buildQueryParams = (arrayObj) => {
  let queryString = arrayObj
    .map((obj) => Object.keys(obj).map((key) => key + '=' + obj[key]))
    .join('&')
  queryString = '?' + queryString
  return queryString
}

export const getCurrentMonthYear = () => {
  const today = new Date()
  const month = moment(today).format('MMM')
  const year = today.getFullYear()
  return {
    month,
    year,
  }
}

export const getYearMonthDiffBetweenDates = (from, to) => {
  const a = moment(from)
  const b = moment(to)
  const monthDiff = b.diff(a, 'months')
  const yearDiff = b.diff(a, 'years')
  const remainingMonthDiff = monthDiff - yearDiff * 12
  let dateDiffString = ''

  if (monthDiff < 12 && monthDiff !== 0) {
    dateDiffString = `${monthDiff} month${monthDiff > 1 ? 's' : ''}`
  }

  if (yearDiff > 0) {
    dateDiffString = `${yearDiff} year${yearDiff > 1 ? 's' : ''}`
    if (remainingMonthDiff > 0) {
      dateDiffString += ` ${remainingMonthDiff} month${remainingMonthDiff > 1 ? 's' : ''}`
    }
  }

  return dateDiffString
}

export const getFromObject = (obj, allowedAttributes) => {
  const emptyList = [undefined, null, '', {}, []]
  const response = {}

  for (const key of Object.keys(obj)) {
    if (allowedAttributes.includes(key) && !emptyList.includes(obj[key])) {
      response[key] = obj[key]
    }
  }

  return response
}


/**
 * format strings that include {{text}} 
 * @param {*} string e.g. View {{jobs}} jobs hiring
 * @param  {...any} args the replace params
 * @return {String} e.g. View 3 jobs hiring
 */
export const formatTemplateString = (string, ...args) => {
  if (!string) {
    return string
  }
  const matchedStrings = [...string.matchAll(/{{[^\}]*}}/g)].map(item => escapeRegExp(item[0]));

  if (matchedStrings.length !== args.length) {
    throw new Error('Those replace arguments are not matched the placeholders, please check the source string: "' + string + '"')
  }
  matchedStrings.forEach((regStr, index) => string = string.replace(new RegExp(regStr), args[index]));

  return string
}