import { TOGGLE_MENU } from 'store/types/navigationBar/toggleMenu'

const initialState = {
  menu: false,
}

const toggleMenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      return { ...state, menu: action.payload }
    default:
      return state
  }
}

export default toggleMenuReducer
