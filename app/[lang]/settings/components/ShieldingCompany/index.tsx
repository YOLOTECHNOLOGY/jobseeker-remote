import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { debounce } from 'lodash-es'
import {
  fetchSearchCompanyService,
  fetchBlacklistCompaniesService,
  fetchAddBlacklistCompaniesService,
  fetchDeleteBlacklistCompaniesService
} from 'store/services/companies2/fetchBlackCompany'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import Empty from '../Empty'
import List from './List'
import Modal from '../Modal'

import styles from './index.module.scss'

interface IProps {
  lang: any
}

const ShieldingCompany = (props: IProps) => {
  const { lang } = props
  const { accountSetting = {} } = lang
  const dispatch = useDispatch()

  const [open, setOpen] = useState<boolean>(false)
  const [openUnlock, setOpenUnlock] = useState<boolean>(false)

  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [list, setList] = useState<Array<any>>([])

  const [searchList, setSearchList] = useState<Array<any>>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [checkedCompany, setCheckedCompany] = useState([])

  const [showSearchModal, setShowSearchModal] = useState(true)

  const handleError = (error) => {
    const { data } = error.response
    let errorMessage
    if (data?.data) {
      errorMessage = data?.data?.detail ?? data?.message
    } else {
      errorMessage = data?.errors?.phone_num[0]
    }
    dispatch(
      displayNotification({
        open: true,
        message: errorMessage || data.message,
        severity: 'error'
      })
    )
  }

  const blackListCompanies = () => {
    fetchBlacklistCompaniesService({ page: 1, size: 100 })
      .then((res) => {
        const resData = res?.data?.data?.blacklist_companies || []
        setList(resData)
      })
      .catch((err) => {
        handleError(err)
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
        handleError(err)
      })
  }

  // const handleUpdateBlackStatus = (companyIds) => {
  //   const list = [...searchList].map((item) => {
  //     if (companyIds.includes(item.id)) {
  //       item.is_blacklisted = false
  //     }
  //     return item
  //   })
  //   setList([...list])
  // }

  const deleteBlackCompanies = (companyId) => {
    fetchDeleteBlacklistCompaniesService({ id: companyId })
      .then(() => {
        setOpenUnlock(false)
        if (!showSearchModal) {
          setOpen(true)
          setShowSearchModal(true)
          filterCompany(searchValue)
        }
        // refresh backlist companies
        blackListCompanies()
      })
      .catch((err) => {
        console.log(err)
        handleError(err)
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
    const params = {
      explain: 1,
      size: 10,
      page: 1,
      show_blacklisted: 1,
      query: newValue
    }
    fetchSearchCompanyService(params).then((res) => {
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
      deleteBlackCompanies(id)
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
        <div className={styles.mainTitle}>{accountSetting?.tabs?.shieldingCompany}</div>
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
          <List lang={lang} handleClick={(data) => handleBlackCompany(data, false)} list={list} />
        ) : (
          <Empty style={{ marginTop: '80px' }} lang={lang} />
        )}
      </div>

      <Modal
        key={'open'}
        open={open}
        cancel={accountSetting?.cancel}
        confirm={accountSetting?.yes}
        handleSave={handleConfirm}
        handleClose={() => setOpen(false)}
        title='Add'
        lang={{}}
      >
        <div className={styles.modal}>
          <p className={styles.title}>{accountSetting?.blockMessages?.title}</p>
          <div className={styles.search}>
            <MaterialTextField
              label={accountSetting?.blockMessages?.searchLabel}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            ></MaterialTextField>
            <MaterialButton className={styles.searchButton} variant='contained' capitalize>
              {accountSetting?.search}
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
                            {accountSetting?.blockMessages?.unblock}
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
              <h5>{accountSetting?.blockMessages?.tip1}：</h5>
              <p>{accountSetting?.blockMessages?.tip2}</p>
              <p>{accountSetting?.blockMessages?.tip3}</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        key={'openUnlock' + companyInfo?.id}
        open={openUnlock}
        cancel={accountSetting?.cancel}
        confirm={accountSetting?.yes}
        handleSave={handleConfirmUnClock}
        handleClose={handleCloseUnlock}
        title={accountSetting?.blockMessages?.unlock}
        lang={lang}
      >
        <div className={styles.modal}>
          <h6>{accountSetting?.blockMessages?.unBlockTip1}：</h6>
          <p className={styles.titleUnlock}>{accountSetting?.blockMessages?.unBlockTip2}</p>
        </div>
      </Modal>
    </div>
  )
}

export default ShieldingCompany
