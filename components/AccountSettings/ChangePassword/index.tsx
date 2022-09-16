import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'

// tools

// ui
import { Button } from '@mui/material'

// api
import { changePassword } from 'store/services/auth/changeEmail'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './index.module.scss'
import { removeCookie } from 'helpers/cookies'

const ChangePasswrod = ({ label, setEdit, edit, errorText }: any) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [isBtnDisabled, setBtnDisabled] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [currentPasswordError] = useState(null)
  const [newPasswordError, setNewPasswordError] = useState(null)
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(null)

  const [successState, setSuccessState] = useState(false)

  useEffect(() => {
    if (newPassword === confirmNewPassword && newPassword.length > 8) {
      setBtnDisabled(false)
      setNewPasswordError(null)
      setConfirmNewPasswordError(null)
    } else {
      setBtnDisabled(true)
      setNewPasswordError('Password do not match. Please try again.')
      setConfirmNewPasswordError('Password do not match. Please try again.')
    }
  }, [newPassword, confirmNewPassword])

  const setChangePassword = async () => {
    await changePassword({ old_password: currentPassword, new_password: newPassword }).then(
      ({ data }) => {
        console.log(data)
        if (data.success) {
          setSuccessState(true)
          dispatch(
            displayNotification({
              open: true,
              message: '密码更换成功',
              severity: 'success'
            })
          )
          removeCookie('accessToken')
          router.push('/login/jobseeker?redirect=/dashboard/profile/settings')
        } else {
          displayNotification({
            open: true,
            message: '密码更换失败',
            severity: 'warning'
          })
        }
      }
    )
  }

  const resetPassword = () => {
    setSuccessState(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  return (
    <div className={styles.VerifyMailAndBindEmail}>
      <FieldFormWrapper label={label} edit={edit} setEdit={setEdit} isEdit>
        {edit === 'Password' ? (
          <div className={styles.accessSettingsContainer_fromWrapper}>
            <Text>To receive job applications update, please verify your email.</Text>
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
                {currentPasswordError && errorText(currentPasswordError)}

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
                <Button variant='contained' disabled={isBtnDisabled} onClick={resetPassword}>
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
