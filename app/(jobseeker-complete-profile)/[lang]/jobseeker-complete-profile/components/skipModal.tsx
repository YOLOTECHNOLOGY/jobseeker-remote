import React, {useContext} from 'react'
import styles from '../index.module.scss'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import { LinkContext } from 'app/[lang]/components/providers/linkProvider'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
interface dialogProps{
    closeFun:()=>void
}

const SkipModal = ({ closeFun } : dialogProps) => {
    const { push } = useContext(LinkContext)
    const {
        profile: {
            skip,
            skipTips,
            skipTipsSure,
            skipAnyway,
            cancel
        }
      } = useContext(languageContext) as any
  return (
    <div className={styles.skipModal}>
     <div className={styles.bg}></div> 
     <div className={styles.modalContainer}>  
      <div className={styles.modalHeader}>
       {skip}
        <IconButton
          aria-label='close'
          onClick={closeFun}
          sx={{
            position: 'absolute',
            right: 8,
            top: 10,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.tips}>
        {skipTips}</p>
        <p className={styles.tips}>{skipTipsSure}</p>
        
      </div>
      <div className={styles.modalFooter}>
      <LoadingButton
          variant='contained'
          onClick={closeFun}
          sx={{
            padding:'12px 38px',
            height: '44px',
            textTransform: 'capitalize',
            boxShadow: 'none',
            borderRadius: '10px',
            border: '1px solid #136FD3',
            background: 'transparent',
            color: '#136FD3',
            minWidth:'156px',
            marginRight:'10px'
          }}
        >{cancel}</LoadingButton>
        <LoadingButton
          variant='contained'
          disabled={false}
          onClick={()=> push(`/`)}
          sx={{
            padding:'12px 38px',
            minWidth:'156px',
            height: '44px',
            textTransform: 'capitalize',
            boxShadow: 'none',
            borderRadius: '10px',       
          }}
        >
          <span>{skipAnyway}</span>
        </LoadingButton>
       
      </div>
      </div> 
    </div>
  )
}

export default SkipModal
