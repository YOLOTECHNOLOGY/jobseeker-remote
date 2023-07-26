import React, { useState } from 'react'
import styles from './index.module.scss'
import Empty from '../Empty'
import List from './List'
import Modal from '../Modal'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
interface IProps {
  lang: any
}

const ShieldingCompany = (props: IProps) => {
  const { lang } = props
  const [open, setOpen] = useState<boolean>(false)
  const [openUnlock, setOpenUnlock] = useState<boolean>(true)

  const handleConfirm = () => {}
  return (
    <div className={styles.main}>
      <div className={styles.mainNav}>
        <div className={styles.mainTitle}>Shielding Company</div>
        <div className={styles.mainAdd} onClick={() => setOpen(true)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='26'
            height='27'
            viewBox='0 0 26 27'
            fill='none'
          >
            <circle cx='12.9998' cy='13.2694' r='9.48029' fill='#2378E5' />
            <path
              d='M7.5 13.456H18.5M12.958 7.76953V18.7695'
              stroke='white'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
        </div>
      </div>

      <div className={styles.mainContent}>
        <List />
        {/* <Empty style={{ marginTop: '80px' }} lang={lang} /> */}
      </div>
      <Modal
        key={'open'}
        open={open}
        cancel='Cancel'
        confirm='yes'
        handleSave={handleConfirm}
        handleClose={() => setOpen(false)}
        title='Add'
        lang={{}}
      >
        <div className={styles.modal}>
          <p className={styles.title}>
            After adding blocked companies, you and the bosses of these companies will not be
            recommended to each other, and your viewing behavior will not be notified to each other
          </p>
          <div className={styles.search}>
            <MaterialTextField
              label={'Job title or company'}
              className={styles.searchInput}
            ></MaterialTextField>
            <MaterialButton className={styles.searchButton} variant='contained' capitalize>
              Search
            </MaterialButton>
          </div>
          <div className={styles.list}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={
                  <p className={styles.item}>
                    <span> xxxxx company</span> Unblock
                  </p>
                }
              />
            </FormGroup>
          </div>
          <div className={styles.tips}>
            <h5>The company can be searched by：</h5>
            <p>
              Full name of the company: such as "Beijing Huapin Borui Network Technology Co., Ltd."
            </p>
            <p>Company abbreviation: such as "BOSS Direct Employment</p>
          </div>
        </div>
      </Modal>

      <Modal
        key={'openUnlock'}
        open={openUnlock}
        cancel='Cancel'
        confirm='yes'
        handleSave={handleConfirm}
        handleClose={() => setOpenUnlock(false)}
        title='Unblock'
        lang={{}}
      >
        <div className={styles.modal}>
          <h6>The following related companies will be unblocked at the same time：</h6>
          <p className={styles.titleUnlock}>
            The company is referred to as Changdian, related companies of Chongqing Changdian
            Network
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default ShieldingCompany
