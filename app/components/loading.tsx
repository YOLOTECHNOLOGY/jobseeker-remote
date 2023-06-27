'use client'
// import styles from './index.module.scss'
import { BossjobLogo } from 'images'
import { LinearProgress } from '@mui/material'
export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: 200,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: ' translate(-50%, -50%)',
      color: '#136fd3'
    }}>
      <div style={{ marginBottom: 16 }}>
        <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
      </div>
      <div style={{ width: 200 }}>
        <LinearProgress />
      </div>
    </div>
  )
}
