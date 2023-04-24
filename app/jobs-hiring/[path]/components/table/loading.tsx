'use client'
import React from 'react'
// import styles from './index.module.scss'
// import Loader from 'react-content-loader'
//  import { CircularProgress } from 'app/components/MUIs'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import styles from '../../index.module.scss';

const Loading = () => {
    // const rects = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']
     
    // return <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    //     <CircularProgress color={'primary'} size={40} />
    //     {/* {rects.map((_, index) => {
    //             return (   <Loader key={index} style={{ width: '100%', height: '100%' }}></Loader>)
    //         })} */}

    // </div>
    return  <Box sx={{ width: '100%',marginBottom:'8px' }}>
    {
        [1,2,3,4,5,6].map((e) => {
            return (
            <div className={styles.loadingSke} key = {e}>
             <div className={styles.top}>
             <Skeleton animation="wave" height={16} width="60%" />
             <Skeleton animation="wave" variant="circular" width={40} height={40}  style={{margin:'0 10px 0 20px'}}/>  
             <Skeleton animation="wave" height={16} width="24%" />
            </div> 
            <Skeleton animation="wave" height={16} width="50%" style={{ marginBottom: 12 }} />    
            <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
            </div>
            )
        })
            }            
  </Box>     
}

export default Loading