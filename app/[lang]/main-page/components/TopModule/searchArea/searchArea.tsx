'use client'
import React, { useEffect, useState, useTransition, useCallback, useContext, useMemo } from 'react'
import { flatMap, toPairs } from 'lodash-es'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
import styles from 'app/[lang]/index.module.scss'

import MaterialButton from 'components/MaterialButton'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import useSearchHistory from 'helpers/useSearchHistory'
import { useRouter } from 'next/navigation'
import { LocationContext } from '../../../../components/providers/locationProvier'
import { languageContext } from '../../../../components/providers/languageProvider'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import { AppDownQRCode } from 'images'
import Image from 'next/image'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SearchIcon from '@mui/icons-material/Search'
import { getCountryId } from 'helpers/country';
import LocationMultiSelector from 'app/[lang]/components/commons/locationMulty'
import { encode } from 'app/[lang]/jobs-hiring/interpreters/encoder'
import { getCookie, setCookie } from 'helpers/cookies'

const transQs = (params: any) => {
  return params.map((e, index) => `query_histories[${index}]=${e}`).join('&')
}
const SearchArea = (props: any) => {
  const { config, langKey } = props
  const dispatch = useDispatch()
  const { location: defaultLoaction } = useContext(LocationContext)
  const flatLocations = useMemo(() => {
    return flatMap(config.location_lists ?? [], item => item.locations)
  }, [config])
  const [location, setLocation] = useState(flatLocations.filter(item => item.id === defaultLoaction?.id))
  const data: any = useContext(languageContext)
  const home = data.home

  const router = useRouter()
  const [isShow, setIsShow] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', useFn)
    return () => {
      window.removeEventListener('scroll', useFn)
    }
  }, [])
  useEffect(() => {
      setCookie('location', location)
      router.refresh()
  }, [location])
  const pushJobPage = useCallback(
    (value) => {
      const result = encode({
        query: value?.trim?.(),
        location: location?.map((a) => a['seo_value'])
      })
      const url = new URLSearchParams(toPairs(result.params)).toString()
      console.log({ url })
      router.push('/' + langKey + '/jobs-hiring/' + result.searchQuery + '?' + url, { forceOptimisticNavigation: true })
      // router.push('/' + langKey + query, { forceOptimisticNavigation: true })
    },
    [location, router]
  )

  const [suggestionList, setSuggestionList] = useState([])

  useEffect(() => {
    if (config) {
      dispatch(fetchConfigSuccess(config))
    }
  }, [config])
  const [searchValue, setSearchValue] = useState('')
  const [searchHistories, addSearchHistory] = useSearchHistory()
  const [, transitionStart] = useTransition()

  const handleSuggestionSearch = useCallback(
    (val) => {
      transitionStart(() => {
        const valueLength = val?.length ?? 0
        if (valueLength === 0) {
          setSuggestionList(searchHistories as any)
        } else if (valueLength === 1) {
          setSuggestionList([])
        } else if ((val?.length ?? 0) > 1) {
          fetch(
            `${process.env.JOB_BOSSJOB_URL}/search-suggestion?size=5&query=${val}&${transQs(
              searchHistories
            )}`, {
            headers: {
              'Country-Id': String(getCountryId())
            }
          })
            .then((resp) => resp.json())
            .then((data) => setSuggestionList(data.data.items))
        }
      })
    },
    [transitionStart]
  )
  const throttle = (func, delay) => {
    let timer = null
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          func()
          timer = null
        }, delay)
      }
    }
  }

  const isTouchBottom = () => {
    const width = document.body.clientWidth
    if (width > 751) {
      const scrollTopHeight = document.body.scrollTop || document.documentElement.scrollTop
      if (scrollTopHeight > 180) {
        return setIsShow(true)
      }
    }
    setIsShow(false)
  }
  const useFn = throttle(() => {
    isTouchBottom()
  }, 300)

  const styleleSelect = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  }

  return (
    <div className={`${styles.searchArea} ${isShow ? styles.searchAreaFix : ''}`}>
      <div className={styles.box}>

        <LocationMultiSelector
          className={styles.location}
          // locationList={config.location_lists}
          value={location}
          label={home.search.location}
          onChange={setLocation}
          lang={home.search}
          sx={{
            '> .MuiFormControl-root': {
              borderRadius: '10px',
              height: '40px',
              marginTop: '4px',
              overflow: 'hidden',
              '> .MuiOutlinedInput-root': {
                borderRadius: '10px',
                height: '40px',
                overflow: 'hidden',
                marginTop: '4px'
              }
            }
          }}
        />
        <MaterialTextFieldWithSuggestionList
          id='search'
          label={home.search.title}
          variant='outlined'
          size='small'
          className={styles.search}
          renderOption={(props, option) => {
            const { type, is_history: isHistory, value, logo_url: logoUrl } = option || {}
            return type === 'company' ? (
              <li {...props} style={styleleSelect}>
                <Image src={logoUrl} alt={value} width='22' height='22' />
                <span style={{ paddingLeft: '10px' }}>{value}</span>
              </li>
            ) : isHistory ? (
              <li {...props} style={{ ...styleleSelect, color: '#136fd3' }}>
                <AccessTimeIcon />
                <span style={{ paddingLeft: '10px' }}>{value}</span>
              </li>
            ) : (
              <li {...props} style={styleleSelect}>
                <SearchIcon />
                <span style={{ paddingLeft: '10px' }}>{value || option}</span>
              </li>
            )
          }}
          // defaultValue={defaultValues?.urlQuery}
          value={searchValue}
          maxLength={255}
          searchFn={handleSuggestionSearch}
          updateSearchValue={setSearchValue}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              setSearchValue((e.target as HTMLInputElement).value)
              addSearchHistory((e.target as HTMLInputElement).value)
              pushJobPage((e.target as HTMLInputElement).value)
            }
          }}
          options={suggestionList}
          onSelect={(value: any) => {
            setSearchValue(value)
            addSearchHistory(value)
            pushJobPage(value)
          }}
        />
        <MaterialButton
          className={styles.searchButton}
          onClick={() => {
            if (!searchValue) return
            addSearchHistory(searchValue)
            pushJobPage(searchValue)
          }}
          style={{
            textTransform: 'capitalize'
          }}
        >
          {' '}
          {home.search.btn1}{' '}
        </MaterialButton>
        {isShow && (
          <div className={styles.download}>
            <PhoneIphoneIcon className={styles.icon} />
            <p>
              {' '}
              {home.search.download}
              <br />
              {home.search.chatBoss}
            </p>
            <div className={styles.popver}>
              <Image src={AppDownQRCode} alt='app down' width='104' height='104' />
              <p>{home.search.popup.chatBoss}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default SearchArea
