import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import styles from './index.module.scss'
import { useAutocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { flatMapDeep } from 'lodash-es'
import SearchBar from './searchBar'


export default function PrimarySearchAppBar({ title, onChange }: any) {

  const jobFunctions = useSelector((store: any) => store.config.config.response?.inputs?.job_function_lists ?? [])

  const options = useMemo(() => flatMapDeep(jobFunctions,
    item =>
      Object.keys(item)
        .map(mainCategory => item[mainCategory]
          .map(subItem => subItem.job_titles
            .map(title => ({ ...title, mainCategory, subCategory: subItem.value }))))
  ), [jobFunctions])
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value
  } = useAutocomplete({
    id: 'use-autocomplete-demo',
    options,
    getOptionLabel: (option: any) => option.value,
  });
  console.log('value', value)
  useEffect(() => {
    if (value) {
      onChange?.(value)
    }
  }, [value])
  return (
    <Box sx={{ flexGrow: 1 }}>

      <Toolbar style={{ background: '#F9F9F9', borderBottom: '1px solid #ccc' }}>
        <span className={styles.title}>{title}</span>


      </Toolbar>
      <div className={styles.searchBar}  {...getRootProps()} >
        <SearchBar style={{background:'#00000000'}} inputProps={getInputProps()} />
        {groupedOptions.length > 0 ? (
          <div className={styles.listbox}  {...(getListboxProps() as any)}>
            {(groupedOptions as any).map((option, index) => (
              <div
                {...(getOptionProps({ option, index }) as any)}
                key={'' + option.title + option.id + index}
              >
                <div className={styles.searchItem}>
                  <label className={styles.mainLabel}>{option.value}</label>
                  <label className={styles.subLabel}>{option.mainCategory + ' - ' + option.subCategory}</label>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Box>
  );
}