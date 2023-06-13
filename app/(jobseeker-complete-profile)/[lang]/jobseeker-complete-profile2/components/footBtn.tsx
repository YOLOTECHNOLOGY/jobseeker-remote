import React from "react";
import LoadingButton from '@mui/lab/LoadingButton'
import styles from '../index.module.scss'

interface btnProps{
    handleClick?:any,
    backClick?:()=>void,
    loading?:boolean,
    rightText?:string,
    showBack?:boolean 
}
const FootBtn = (
    {
        handleClick,
        loading,
        backClick,
        rightText,
        showBack = true
    }:btnProps)=>{
 
  return <div className={styles.next}>
  <LoadingButton
    onClick={handleClick}
    loading={loading}
    variant='contained'
    disabled
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
    <span>{rightText}</span>
  </LoadingButton>
  {
    showBack &&  <LoadingButton
    onClick={backClick}
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
  }
 
</div>
}

export default FootBtn