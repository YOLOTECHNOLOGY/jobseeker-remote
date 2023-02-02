// unhandled_code_range will be an array of size 2 [lower_bound, upperbound]
// by default, server error responses will not be handled by client
export const checkErrorCode = (error, unhandled_code_range = [500, 599]) =>
  error?.response?.status >= unhandled_code_range[0] &&
  error?.response?.status <= unhandled_code_range[1]
