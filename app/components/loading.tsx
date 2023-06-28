/* eslint-disable @next/next/no-img-element */
'use client'
// import styles from './index.module.scss'
// import { BossjobLogo } from 'images'
// import { LinearProgress } from '@mui/material'
import { useEffect, useRef } from 'react';
import Lottie from 'lottie-web';
export default function Loading() {
  const container = useRef()
  useEffect(() => {
    Lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("images/loading.json")
    });

    // Lottie.play()
    return () => {
      Lottie.destroy();
    };
  }, []);

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
      <div ref={container} />
      {/* <div style={{ marginBottom: 16 }}>
        <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
      </div>
      <div style={{ width: 200 }}>
        <LinearProgress />
      </div> */}
    </div>
  )
}
