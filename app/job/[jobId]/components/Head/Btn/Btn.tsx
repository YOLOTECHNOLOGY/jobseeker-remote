'use client'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import MaterialButton from 'components/MaterialButton'
import { Button, Stack } from 'app/components/MUIs'
import { FavoriteBorderIcon, FavoriteIcon } from 'app/components/MuiIcons'

import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'

type propsType = {
  is_saved: boolean
  chat: any
  jobId: number
  className?: string
}

const Btn = ({ jobId, chat, is_saved, className }: propsType) => {
  const dispatch = useDispatch()
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  // const [chatLoading, setChatLoading] = useState<boolean>(false)

  const [isSave, setIsSave] = useState<boolean>(is_saved)

  useEffect(() => {
    setIsSave(is_saved)
  }, [is_saved])

  const handleSaveJob = () => {
    setSaveLoading(true)
    const params = {
      job_id: jobId
    }

    postSaveJobService(params)
      .then(({ status }) => {
        if (status === 201) {
          setIsSave(true)
        }
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            message: error.message ? error.message : 'Save job fail',
            severity: 'error'
          })
        )
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }

  const handleUnSaveJob = () => {
    setSaveLoading(true)

    deleteSaveJobService(jobId)
      .then(({ status }) => {
        if (status === 200) {
          setIsSave(false)
        }
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            message: error.message ? error.message : 'UnSave job fail',
            severity: 'error'
          })
        )
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }

  return (
    <>
      <Stack spacing={2} direction='row' className={className}>
        <MaterialButton
          variant='outlined'
          sx={{
            height: '44px',
            background: '#FFFFFF',
            border: '1px solid #136FD3',
            borderRadius: '10px',
            paddingLeft: '13px',
            paddingRight: '13px',
            display: 'flex',
            justifyContent: 'space-between',
            textTransform: 'capitalize'
          }}
          onClick={!isSave ? handleSaveJob : handleUnSaveJob}
          isLoading={saveLoading}
        >
          {isSave ? (
            <>
              <FavoriteIcon sx={{ color: '#136FD3' }} />
              <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}>Undo saved</span>
            </>
          ) : (
            <>
              <FavoriteBorderIcon sx={{ color: '#136FD3' }} />
              <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}> Save</span>
            </>
          )}

          {/* <FavoriteBorderIcon sx={{ color: '#136FD3' }} /> */}
        </MaterialButton>
        <Button
          variant='contained'
          sx={{
            width: '115px',
            lineHeight: '44px',
            height: '44px',
            background: '#136FD3',
            borderRadius: '10px',
            textTransform: 'capitalize'
          }}
        >
          Chat now
        </Button>
      </Stack>
    </>
  )
}

export default Btn
