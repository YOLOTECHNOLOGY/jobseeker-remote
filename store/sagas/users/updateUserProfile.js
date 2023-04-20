import { call, put, takeLatest } from 'redux-saga/effects'
import { UPDATE_USER_PROFILE_REQUEST } from 'store/types/users/updateUserProfile'
import {
  updateUserProfileSuccess,
  updateUserProfileFailed,
} from 'store/actions/users/updateUserProfile'
import {
  fetchUserOwnDetailRequest,
} from 'store/actions/users/fetchUserOwnDetail'
import { updateUserProfileService } from 'store/services/users/updateUserProfile'
import { uploadUserAvatarService } from 'store/services/users/uploadUserAvatar'

/* Helpers */
import { getCookie,setCookie } from 'helpers/cookies'

function* updateUserProfileReq({ payload }) {
  try {
    const accessToken = getCookie('accessToken')
    const profilePayload = {...payload}
    delete profilePayload.avatar

    const { data } = yield call(updateUserProfileService, profilePayload)
    yield put(updateUserProfileSuccess(data.data))

    if (payload.avatar){
      try {
        // TODO: create uploadUserAvatarRequest, uploadUserAvatarSuccess, uploadUserAvatarFailed types, actions and reducer
        const {data} = yield call(uploadUserAvatarService, payload.avatar)
        const userCookie = getCookie('user')
        userCookie.avatar = data.data.avatar
        yield call(setCookie, 'user', userCookie)
      }catch(error){
        console.log('ERROR UPDATING USER AVATAR', error)
      }
    }
    // Refresh userDetail
    yield put(
      fetchUserOwnDetailRequest({accessToken})
    )
  } catch (error) {
    yield put(updateUserProfileFailed(error.response))
  }
}

export default function* updateUserProfileSaga() {
  yield takeLatest(UPDATE_USER_PROFILE_REQUEST, updateUserProfileReq)
}
