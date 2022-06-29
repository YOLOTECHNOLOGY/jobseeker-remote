import React from 'react'
import * as ReactDOM from 'react-dom'
import styles from './TransitionLoader.module.scss'
import CircularProgress from '@mui/material/CircularProgress';

type TransitionLoaderProps = {}

function TransitionLoader({}: TransitionLoaderProps) {
  return ReactDOM.createPortal(
  <div className={styles.wrapper}>
    <div className={styles.loadingIndicator}>
      <CircularProgress />
    </div>  
  </div>, document.body)
}

export default TransitionLoader
