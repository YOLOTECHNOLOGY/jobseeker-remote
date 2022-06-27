import { call, put, takeLatest } from 'redux-saga/effects'
import { REGISTER_USER_REQUEST } from 'store/types/users/registerUser'
import {
  registerUserSuccess,
  registerUserFailed,
} from 'store/actions/users/registerUser'
import { registerUserService } from 'store/services/users/registerUser'
import { getUtmCampaignData, removeUtmCampaign } from 'helpers/utmCampaign'

// TODO: Initially prepared for the Job Alert on public
function* registerUserReq(action) {
  try {
    const payload = action.payload

    const { data } = yield call(registerUserService, {payload, ...(yield* getUtmCampaignData())})

    removeUtmCampaign()

    yield put(registerUserSuccess(data.data))
  } catch (error) {
    yield put(registerUserFailed(error))
  }
}

export default function* registerUserSaga() {
  yield takeLatest(REGISTER_USER_REQUEST, registerUserReq)
}
