import { SET_GLOBAL_ERROR, UNSET_GLOBAL_ERROR } from 'store/types/error/globalError'

const setGlobalError = (error) => ({
  type: SET_GLOBAL_ERROR,
  error,
})

const unsetGlobalError = (state) => ({
  type: UNSET_GLOBAL_ERROR,
  state,
})

export {
  setGlobalError,
  unsetGlobalError
}
