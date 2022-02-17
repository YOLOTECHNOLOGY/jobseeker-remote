import { call, put, takeLatest } from 'redux-saga/effects'
import { UPDATE_USER_COMPLETE_PROFILE_REQUEST } from 'store/types/users/updateUserCompleteProfile'
import {
  updateUserCompleteProfileSuccess,
  updateUserCompleteProfileFailed,
} from 'store/actions/users/updateUserCompleteProfile'
import { updateUserCompleteProfileService } from 'store/services/users/updateUserCompleteProfile'

function* updateUserCompleteProfileReq(action) {
  console.log(action)
  // try {
  //   const { data } = yield call(updateUserCompleteProfileService, action.payload)
  //   yield put(updateUserCompleteProfileSuccess(data.data))
  // } catch (error) {
  //   yield put(updateUserCompleteProfileFailed(error))
  // }
}

export default function* updateUserCompleteProfileSaga() {
  yield takeLatest(UPDATE_USER_COMPLETE_PROFILE_REQUEST, updateUserCompleteProfileReq)
}
