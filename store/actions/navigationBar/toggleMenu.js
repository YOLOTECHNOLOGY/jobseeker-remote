import {
  TOGGLE_MENU,
} from 'store/types/navigationBar/toggleMenu'

const toggleMenu = (state) => ({
  type: TOGGLE_MENU,
  payload: state,
})

export { toggleMenu }
