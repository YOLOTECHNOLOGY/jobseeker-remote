'use client'
// import styles from './index.module.scss'
import { BossjobLogo } from 'images'
import { LinearProgress } from '@mui/material'
export default function Loading() {
  // Or a custom loading skeleton component
  // .loading {
  //   &Wrapper {
  //     display: flex;
  //     flex-direction: column;
  //     align-items: center;
  //     max-width: 200px;
  //     position: absolute;
  //     top: 50%;
  //     left: 50%;
  //     transform: translate(-50%, -50%);
  //     color: $primaryBlue;
  //   }

  //   &Logo {
  //     margin-bottom: 16px;
  //   }

  //   &Indicator {
  //     width: 200px;
  //   }
  // }
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
// export default TransitionLoader
