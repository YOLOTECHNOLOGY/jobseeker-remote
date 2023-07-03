import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import styles from './index.module.scss'
import { ThemeProvider } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles'
import { theme, validEmailReg } from './config'

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 22,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 22
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)'
    }
  },
  '& .MuiSwitch-switchBase': {
    padding: 1,
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 20,
    height: 20,
    borderRadius: 10,
    transition: theme.transitions.create(['width'], {
      duration: 200
    })
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box'
  }
}))

interface ModalJobAlertsProps {
  open: boolean
  email?: string
  message: string
  handleClose: () => void
  handleSave: Function
}

export default function FormDialog(props: ModalJobAlertsProps) {
  const { open, email = '',message, handleClose, handleSave } = props

  const [frequency, setFrequency] = useState('1')
  const [mail, setEmail] = useState(email)
  const [checked, setChecked] = useState(true)
  const [mailError, setMailError] = useState('')

  useEffect(() => {
    setEmail(email)
  }, [email])

  useEffect(() => {
    if(mail !== '') {
      setMailError(validEmail(mail))
    }
  }, [mail])

  const validEmail = (value: string) => {
    let errorMessage = !validEmailReg.test(value) ? 'Email is not valid.' : ''
    if(value == '') {
      errorMessage = 'Email is not empty.'
    }
    return errorMessage
  }

  const handleChange = (event: SelectChangeEvent) => {
    setFrequency(event.target.value as string)
  }

  const handleCloseMethod = () => {
    handleClose()
  }

  const handleSaveMethod = () => {
    const errorMessage = validEmail(mail || '')
    let isError = errorMessage.length > 0
    if(!checked) {
      isError = false
    }
    if(!isError) {
      handleSave({ mail, frequency, checked })
    }else {
      setMailError(errorMessage)
    }
  }

  const handleChangeSwitch = (ev) => {
    setChecked(ev.target.checked)
    if(!ev.target.checked) {
      setMailError('')
    }else {
      setMailError(validEmail(mail))
    }
  }


  const handleKeyUp = (ev) => {
    const value = ev?.target?.value || ''
    setMailError(validEmail(value))
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleCloseMethod}>
        <DialogTitle>Job Alert setting</DialogTitle>
        <DialogContent>
          {/* switch */}
          <Stack
            className={styles.jobAlertsModalAction}
            direction='row'
            spacing={1}
            alignItems='center'
            justifyContent='space-between'
          >
            <div className={styles.jobAlertsModalSwitch}>Job Alert</div>
            <Stack direction='row' spacing={1} alignItems='center'>
              <AntSwitch
                onChange={handleChangeSwitch}
                value={checked}
                checked={checked}
                inputProps={{ 'aria-label': 'switch' }}
              />
            </Stack>
          </Stack>

          {/* job info */}
          <Stack direction='row' spacing={1} alignItems='center'>
            <div className={styles.jobAlertsModalInfo}>
              Job Conditions:{' '}
              <span className={styles.jobAlertsModalInfoText}>{message}</span>
            </div>
          </Stack>
          <div className={styles.jobAlertsModalFormControl}>
            {/* frequency */}
            <FormControl sx={{ width: 460, margin: 0 }}>
              <div className={styles.jobAlertsModalFormControlTitle}>Frequency</div>
              <Select
                size='small'
                variant='outlined'
                value={frequency}
                onChange={handleChange}
                displayEmpty
                disabled={!checked}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={1}>Daily</MenuItem>
                <MenuItem value={2}>Weekly</MenuItem>
              </Select>
              
            </FormControl>

            {/* email */}
            <FormControl sx={{ width: 460, margin: 0 }}>
              <div className={styles.jobAlertsModalFormControlTitle}>Send to email</div>
              <TextField
                size='small'
                autoFocus
                margin='dense'
                type='email'
                fullWidth
                variant='outlined'
                placeholder='Email address'
                value={mail}
                disabled={!checked}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={handleKeyUp}
              />
              {mailError ? <FormHelperText>{mailError}</FormHelperText> : null}
            </FormControl>
          </div>

          {/* divider line */}
          <div className={styles.jobAlertsModalDivider}></div>
        </DialogContent>

        <DialogActions>
          <div className={styles.jobAlertsModalCancel} onClick={handleCloseMethod}>
            Cancel
          </div>
          <div className={styles.jobAlertsModalSave} onClick={handleSaveMethod}>
            Done
          </div>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}
