// export const urlValidation = (value) => {
//   if (value && (value.includes('https://https://'))) {
//     return 'Please enter a valid URL.'
//   } else {
//     return null
//   }
// }

export const urlValidation = (value) => {
  const urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  const urlRegex = new RegExp(urlExpression)

  if (value && !value.match(urlRegex)) {
    return 'Please enter a valid URL.'
  } else {
    return null
  }
}