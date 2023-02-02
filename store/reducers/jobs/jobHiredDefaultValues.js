export default function jobHiredDefaultValues(state = {}, action) {
    switch (action.type) {
      case 'SET_JOB_HIRE_DEFAULT_VALUE':
        return { ...state, ...action.payload }
      default:
        return { ...state }
    }
  }