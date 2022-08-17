export const urlValidation = (value) => {
  if (value && (!value.includes('http://') && !value.includes('https://'))) {
    return 'Please enter a valid URL.'
  } else {
    return null
  }
}