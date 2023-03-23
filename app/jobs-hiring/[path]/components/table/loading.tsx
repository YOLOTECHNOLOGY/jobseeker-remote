import React from 'react'
// import styles from './index.module.scss'
// import Loader from 'react-content-loader'
import { CircularProgress } from 'app/components/MUIs'

const Loading = () => {
    // const rects = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']
    return <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress color={'primary'} size={40} />
        {/* {rects.map((_, index) => {
                return (   <Loader key={index} style={{ width: '100%', height: '100%' }}></Loader>)
            })} */}

    </div>
}

export default Loading