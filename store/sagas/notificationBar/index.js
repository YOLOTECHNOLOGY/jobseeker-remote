import { put, takeEvery, delay } from 'redux-saga/effects'
import { closeNotification } from 'store/actions/notificationBar/notificationBar'
import { DISPLAY_NOTIFICATION } from 'store/types/notificationBar/notificationBar'

let refCount = 0
function* autoDisappearNotification() {
    refCount++
    yield delay(3000)
    refCount--
    if (refCount === 0) {
        yield put(closeNotification())
    }

}

export default function* notificationBar() {
    yield takeEvery(DISPLAY_NOTIFICATION, autoDisappearNotification)
}
