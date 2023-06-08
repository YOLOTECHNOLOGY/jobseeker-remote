/**
 * Encodes a string to be used in a URL by base64 encoding and URI-encoding it.
 *
 * @param {string} str - the string to be encoded
 * @return {string} the encoded string
 */
export const enCodeUrl = (str:string) => {
  return encodeURIComponent(window.btoa(str))
}

/**
 * Decodes a URL encoded string by base64 decoding it and then
 * decoding the resulting string.
 *
 * @param {string} str - The URL encoded string to decode
 * @return {string} The decoded string
 */
export const deCodeUrl = (str:string) => {
  return decodeURIComponent(window.atob(str))
}

/**
 * Parses a JSON string into an object.
 *
 * @param {string} str - The JSON string to be parsed.
 * @return {any} The resulting object, or an empty object if parsing fails.
 */
export const parseJsonParams = (str:string) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}