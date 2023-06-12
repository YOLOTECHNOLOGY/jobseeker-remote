import React from "react";
import LoadingButton from '@mui/lab/LoadingButton'
import styles from '../index.module.scss'

interface btnProps{
    handleClick?:()=>void,
    backClick?:()=>void,
    loading?:boolean,
    rightText?:string 
}
const FootBtn = (
    {
        handleClick,
        loading,
        backClick,
        rightText,
    }:btnProps)=>{
 
 
    
  return <div className={styles.next}>
  <LoadingButton
    onClick={backClick}
    loading={loading}
    variant='contained'
    sx={{
        width: '202px',
        height: '44px',
        textTransform: 'capitalize',
        boxShadow: 'none',
        borderRadius: '10px',
      background: '#F0F0F0',
      color: '#707070',
    }}
  >
    <span>{rightText} Next (1/4)</span>
  </LoadingButton>
  <LoadingButton
    onClick={handleClick}
    loading={loading}
    variant='contained'
    sx={{
        width: '202px',
        height: '44px',
        textTransform: 'capitalize',
        boxShadow: 'none',
        borderRadius: '10px',
       border: '1px solid #136FD3',
       background: 'transparent',
       color: '#136FD3',
    }}
  >
    <span>back</span>
  </LoadingButton>
</div>
}

export default FootBtn