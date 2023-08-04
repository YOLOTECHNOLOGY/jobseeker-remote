import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'
import { useFirstRender } from 'helpers/useFirstRender'

// tools

// ui
import { Button } from '@mui/material'

// api
import { changePassword } from 'store/services/auth/changePassword'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './index.module.scss'
import { useRouter } from 'next/router'

const ChangePasswrod = ({ label, setEdit, edit, errorText }: any) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const firstRender = useFirstRender()
  const [isBtnDisabled, setBtnDisabled] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [currentPasswordError, setCurrentPasswordError] = useState(null)
  const [newPasswordError, setNewPasswordError] = useState(null)
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(null)

  const [successState, setSuccessState] = useState(false)

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (newPassword === confirmNewPassword) {
      setBtnDisabled(false)
      setConfirmNewPasswordError(null)
    } else {
      setBtnDisabled(true)
      setConfirmNewPasswordError('Password do not match. Please try again.')
    }
  }, [confirmNewPassword])

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (newPassword.length >= 8 && newPassword.length <= 16) {
      setBtnDisabled(false)
      setNewPasswordError(null)
    } else {
      setBtnDisabled(true)
      setNewPasswordError('Please enter a longer password (minimum of 8 characters)')
    }
  }, [newPassword])

  const setChangePassword = async () => {
    await changePassword({ old_password: currentPassword, new_password: newPassword })
      .then(({ data }) => {
        if (data.success) {
          setSuccessState(true)
          dispatch(
            displayNotification({
              open: true,
              message: 'Your password has been changed successfully',
              severity: 'success'
            })
          )
        } else {
          dispatch(
            displayNotification({
              open: true,
              message: 'Failed to change password,Please try again later',
              severity: 'warning'
            })
          )
        }
      })
      .catch(() => {
        setCurrentPasswordError('Password is incorrect. Forgot your password? Reset here. ')
        // dispatch(
        //   displayNotification({
        //     open: true,
        //     message: 'Failed to change password,Please try again later',
        //     severity: 'warning'
        //   })
        // )
      })
  }

  const resetPassword = () => {
    setSuccessState(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  const toHrefResetPassword = () => {
    router.push('/reset-password')
  }

  return (
    <div className={styles.VerifyMailAndBindEmail}>
      <FieldFormWrapper label={label} edit={edit} setEdit={setEdit} isEdit>
        {edit === 'Password' ? (
          <div className={styles.accessSettingsContainer_fromWrapper}>
            <div className={styles.accessSettingsContainer_fromWrapper_edit}>
              <div>
                <MaterialTextField
                  className={styles.accessSettingsContainer_fromWrapper_edit_input}
                  label={'Current password'}
                  size='small'
                  error={currentPasswordError ? true : false}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type='password'
                />
                <div onClick={toHrefResetPassword} style={{ cursor: 'pointer' }}>
                  {currentPasswordError && errorText(currentPasswordError)}
                </div>

                <MaterialTextField
                  className={styles.accessSettingsContainer_fromWrapper_edit_input}
                  label={'New password'}
                  size='small'
                  error={newPasswordError ? true : false}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type='password'
                />
                {newPasswordError && errorText(newPasswordError)}

                <MaterialTextField
                  className={styles.accessSettingsContainer_fromWrapper_edit_input}
                  label={'Confirm new password'}
                  size='small'
                  error={confirmNewPasswordError ? true : false}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  type='password'
                />
                {confirmNewPasswordError && errorText(confirmNewPasswordError)}
              </div>
            </div>

            {!successState ? (
              <div className={styles.VerifyMailAndBindEmail_button}>
                <Button variant='contained' disabled={isBtnDisabled} onClick={setChangePassword}>
                  Save
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setEdit(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className={styles.VerifyMailAndBindEmail_button}>
                <Button
                  variant='contained'
                  disabled={isBtnDisabled}
                  onClick={() => {
                    setEdit(null)
                    resetPassword()
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.formWrapper}>
            <Text className={styles.bottomSpacing}>***********</Text>
          </div>
        )}
      </FieldFormWrapper>
    </div>
  )
}

export default ChangePasswrod
