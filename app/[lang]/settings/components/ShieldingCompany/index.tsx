import React, { useState, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import Empty from '../Empty'
import List from './List'
import Modal from '../Modal'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { debounce } from 'lodash-es'
import { fetchCompanyFilterService } from 'store/services/companies2/fetchCompanyFilter'
import { fetchBlacklistCompaniesService } from 'store/services/companies2/fetchBlackCompany'
interface IProps {
  lang: any
}

const ShieldingCompany = (props: IProps) => {
  const { lang } = props
  const [open, setOpen] = useState<boolean>(false)
  const [openUnlock, setOpenUnlock] = useState<boolean>(false)
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [list, setList] = useState<Array<any>>([])
  const [searchList, setSearchList] = useState<Array<any>>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const handleConfirm = () => {}

  useEffect(() => {
    fetchBlacklistCompaniesService().then((res) => {
      console.log(res?.data?.data?.blacklist_companies || [])
      setList(res?.data?.data?.blacklist_companies)
    })
  }, [])

  useEffect(() => {
    if (searchValue) {
    }
  }, [searchValue])

  const handleClick = (data, showModal) => {
    if (showModal) {
      setOpen(false)
    }
    setCompanyInfo(data)
    setOpenUnlock(true)
  }
  console.log(searchValue)
  const handleConfirmUnclock = () => {}

  const debounced = useRef(debounce((newValue) => filterCompany(newValue), 1000))

  useEffect(() => {
    if (searchValue) {
      debounced.current(searchValue)
    }
  }, [searchValue])

  const filterCompany = (newValue) => {
    const param = {
      explain: 1,
      size: 8,
      page: 1,
      show_blacklisted: 1,
      query: newValue
    }
    fetchCompanyFilterService(param).then((res) => {
      console.log(res?.data?.data?.companies)
      setSearchList(res?.data?.data?.companies || [])
    })
  }

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
        <List handleClick={handleClick} list={list} />
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            ></MaterialTextField>
            <MaterialButton className={styles.searchButton} variant='contained' capitalize>
              Search
            </MaterialButton>
          </div>
          {searchList?.length > 0 ? (
            <div className={styles.list}>
              <FormGroup>
                {searchList.map((e) => (
                  <FormControlLabel
                    key={e.id}
                    control={<Checkbox checked={true} />}
                    label={
                      <p className={styles.item}>
                        <span> xxxxx company</span>{' '}
                        <i onClick={(e) => handleClick(e, true)}>Unblock</i>
                      </p>
                    }
                  />
                ))}
              </FormGroup>
            </div>
          ) : (
            <div className={styles.tips}>
              <h5>The company can be searched by：</h5>
              <p>
                Full name of the company: such as "Beijing Huapin Borui Network Technology Co.,
                Ltd."
              </p>
              <p>Company abbreviation: such as "BOSS Direct Employment</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        key={'openUnlock'}
        open={openUnlock}
        cancel='Cancel'
        confirm='yes'
        handleSave={handleConfirmUnclock}
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
