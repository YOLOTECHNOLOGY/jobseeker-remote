import { SET_GLOBAL_ERROR, UNSET_GLOBAL_ERROR } from "store/types/error/globalError";

export default function globalErrorReducer(state = { error: null }, action) {
    switch (action.type) {
       case SET_GLOBAL_ERROR:
           return { ...state, error: action.error} 
        case UNSET_GLOBAL_ERROR:
            return {...state, error: null}
        default:
            return { ...state }
    }
}