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
import {
  fetchBlacklistCompaniesService,
  fetchAddBlacklistCompaniesService,
  fetchDeleteBlacklistCompaniesService
} from 'store/services/companies2/fetchBlackCompany'

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
  const [checkedCompany, setCheckedCompany] = useState([])

  const [showSearchModal, setShowSearchModal] = useState(true)

  const blackListCompanies = () => {
    fetchBlacklistCompaniesService({ page: 1, size: 100 }).then((res) => {
      const resData = res?.data?.data?.blacklist_companies || []
      setList(resData)
    })
  }
  const addBlackCompanies = (companyIds: Array<number>) => {
    fetchAddBlacklistCompaniesService({ company_ids: companyIds })
      .then((res) => {
        console.log('add', res)
        setOpen(false)
        blackListCompanies()
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const handleUpdateBlackStatus = (companyIds) => {
    const list = [...searchList].map((item) => {
      if (companyIds.includes(item.id)) {
        item.is_blacklisted = true
      }
      return item
    })
    setList(list)
  }

  const deleteBlackCompanies = (companyIds: Array<number>) => {
    fetchDeleteBlacklistCompaniesService({ company_ids: companyIds })
      .then(() => {
        setOpenUnlock(false)
        if (!showSearchModal) {
          setOpen(true)
          setShowSearchModal(true)
          console.log('delete', companyIds)
          handleUpdateBlackStatus(companyIds)
        }
        // refresh backlist companies
        blackListCompanies()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    blackListCompanies()
  }, [])

  const handleBlackCompany = (data, showSearchModal) => {
    if (showSearchModal) {
      setOpen(false)
      setShowSearchModal(false)
    }
    setCompanyInfo(data)
    setOpenUnlock(true)
  }

  console.log(searchValue)

  const handleConfirm = () => {
    if (checkedCompany.length > 0) {
      addBlackCompanies(checkedCompany)
    }
  }

  const debounced = useRef(debounce((newValue) => filterCompany(newValue), 300))

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
      const data = res?.data?.data?.companies || []
      setSearchList(data)
      const resData = data.filter((item) => !item.is_blacklisted)
      setCheckedCompany(resData.map((e) => e.id))
    })
  }

  const handleChange = (event, item) => {
    console.log('event', event.target.checked, item.id)
    const newCheckedCompany = checkedCompany.slice()
    const index = newCheckedCompany.slice().indexOf(item.id)
    if (event.target.checked) {
      newCheckedCompany.push(item.id)
    } else {
      index > -1 && newCheckedCompany.splice(index, 1)
    }
    setCheckedCompany([...newCheckedCompany])
  }

  const handleConfirmUnClock = () => {
    if (companyInfo?.id) {
      const id = companyInfo?.company_id || companyInfo?.id
      deleteBlackCompanies([id])
    }
  }

  const handleCloseUnlock = () => {
    setOpenUnlock(false)
    if (!showSearchModal) {
      setOpen(true)
      setShowSearchModal(true)
    }
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
        {list?.length > 0 ? (
          <List handleClick={(data) => handleBlackCompany(data, false)} list={list} />
        ) : (
          <Empty style={{ marginTop: '80px' }} lang={lang} />
        )}
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
                {searchList.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    onChange={(ev) => handleChange(ev, item)}
                    control={
                      <Checkbox
                        disabled={item.is_blacklisted}
                        checked={checkedCompany.includes(item.id)}
                      />
                    }
                    label={
                      <p className={styles.item}>
                        <span>{item.name}</span>
                        {item.is_blacklisted && (
                          <i
                            onClick={(ev) => {
                              ev.preventDefault()
                              handleBlackCompany(item, true)
                            }}
                          >
                            Unblock
                          </i>
                        )}
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
        key={'openUnlock' + companyInfo?.id}
        open={openUnlock}
        cancel='Cancel'
        confirm='yes'
        handleSave={handleConfirmUnClock}
        handleClose={handleCloseUnlock}
        title='Unblock'
        lang={lang}
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
