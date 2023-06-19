import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from './dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Main from 'app/[lang]/get-started/components/main'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
import styles  from 'app/[lang]/get-started/index.module.scss'




export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface dialogProps{
    open:boolean,
    handleClose?:()=>void
}

export default function LoginDialog({open = true,handleClose}:dialogProps) {
  const data= React.useContext(languageContext) as any
  const { newGetStarted } = data
  console.log({data})
  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        title={newGetStarted?.title}
      >
        <div className={styles.main} style={{margin:0,minHeight:'340px',padding:0}}>
        <div className={styles.container} style={{boxShadow:'none',width:"561px",padding:'15px 33px 33px 33px'}}>
          <Main dictionary={data} />
        </div>
      </div>
      
      </Dialog>
    </div>
  );
}