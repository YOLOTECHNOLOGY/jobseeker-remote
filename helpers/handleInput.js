function numberWithDecimalFilter(val) {
  return /^\d*\.?\d*$/.test(val) // Allow digits and '.' only, using a RegExp
}
function numberFilter(val) {
  return /^[0-9]*$/.test(val)
}
export const handleNumericInput = (val) => {
  return numberFilter(val) ? val : val.slice(0, -1)
}

export const handleNumberWithDecimalInput = (val) => {
  return numberWithDecimalFilter(val) ? val : val.slice(0, -1)
}

export const maxFileSize = (file, maxSize) => {
  return (file.size / 1024 / 1024) < maxSize
}