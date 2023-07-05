import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import styles from './index.module.scss'
import { useAutocomplete } from '@mui/material'
import { useSelector } from 'react-redux'
import { flatMapDeep } from 'lodash-es'
import SearchBar from './searchBar'
import { CloseIcon } from 'images'
import classNames from 'classnames'

export default function PrimarySearchAppBar({ title, onChange, onClose, lang }: any) {
  // const jobFunctions = useSelector(
  //   (store: any) => store.config.config.response?.job_function_lists ?? []
  // )

  const jobFunctionsOptions = useSelector(
    (store: any) => store.config.config.response?.main_job_function_lists ?? []
  )

  // const options = useMemo(
  //   () =>
  //     flatMapDeep(jobFunctions, (item) =>
  //       Object.keys(item).map((mainCategory) =>
  //         item[mainCategory].map((subItem) =>
  //           subItem.job_titles.map((title) => ({
  //             ...title,
  //             mainCategory,
  //             subCategory: subItem.value
  //           }))
  //         )
  //       )
  //     ),
  //   [jobFunctions]
  // )

  const options = useMemo(
    () =>
      flatMapDeep(jobFunctionsOptions, (item: any) => {
        return item['sub_function_list'].map((subItem) =>
          subItem.job_titles.map((title) => ({
            ...title,
            mainCategory: item.value,
            subCategory: subItem.value
          }))
        )
      }),
    [jobFunctionsOptions]
  )

  const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions } =
    useAutocomplete({
      id: 'use-autocomplete-demo',
      options,
      getOptionLabel: (option: any) => option.value,
      // value: outValue,
      // inputValue: outValue?.value,
      onChange: (event: any, newValue: any | null) => {
        onChange(newValue)
      }
    })

  const inputProps = getInputProps() as any

  return (
    <Box>
      <Toolbar
        style={{
          background: '#F9F9F9',
          borderBottom: '1px solid #ccc',
          justifyContent: 'space-between'
        }}
      >
        <>
          <div className={styles.wrapper_search}>
            <span className={styles.title}>{title}</span>
            <div
              className={classNames([styles.searchBar, styles.web_searchBar])}
              {...getRootProps()}
            >
              <SearchBar style={{ background: '#00000000' }} lang={lang} inputProps={inputProps} />
              {groupedOptions.length > 0 && (inputProps as any)?.value?.length > 0 ? (
                <div className={styles.listbox} {...(getListboxProps() as any)}>
                  {(groupedOptions as any).map((option, index) => (
                    <div
                      {...(getOptionProps({ option, index }) as any)}
                      key={'' + option.title + option.id + index}
                    >
                      <div className={styles.searchItem}>
                        <label className={styles.mainLabel}>{option.value}</label>
                        <label className={styles.subLabel}>
                          {option.mainCategory + ' - ' + option.subCategory}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <img
            style={{ cursor: 'pointer' }}
            src={CloseIcon}
            title='close modal'
            alt='close modal'
            width='14'
            height='14'
            onClick={() => onClose(false)}
          />
        </>
      </Toolbar>
      <div className={styles.searchBar} {...getRootProps()}>
        <SearchBar style={{ background: '#00000000' }} lang={lang} inputProps={inputProps} />
        {groupedOptions.length > 0 && (inputProps as any)?.value?.length > 0 ? (
          <div className={styles.listbox} {...(getListboxProps() as any)}>
            {(groupedOptions as any).map((option, index) => (
              <div
                {...(getOptionProps({ option, index }) as any)}
                key={'' + option.title + option.id + index}
              >
                <div className={styles.searchItem}>
                  <label className={styles.mainLabel}>{option.value}</label>
                  <label className={styles.subLabel}>
                    {option.mainCategory + ' - ' + option.subCategory}
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Box>
  )
}
