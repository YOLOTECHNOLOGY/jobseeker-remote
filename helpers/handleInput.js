function numberWithDecimalFilter(val) {
  return /^\d*\.?\d*$/.test(val) // Allow digits and '.' only, using a RegExp
}
function numberFilter(val) {
  return /^[0-9]*$/.test(val)
}
export const handleNumericInput = (val) => {
  console.log('VALUE: ', val)
  return numberFilter(val) ? val : val.slice(0, -1)
}

export const handleNumberWithDecimalInput = (val) => {
  return numberWithDecimalFilter(val) ? val : val.slice(0, -1)
}
