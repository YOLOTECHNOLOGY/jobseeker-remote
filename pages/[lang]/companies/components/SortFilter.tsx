import React, { useEffect, useState } from 'react'
import Multiple from 'app/[lang]/components/commons/select/multiple'
import LocationField1 from 'app/[lang]/components/mobile/location1'
import styles from '../Companies.module.scss'
import theme from 'app/[lang]/components/commons/theme'
import { ThemeProvider } from '@mui/material/styles'
import { Button } from 'app/[lang]/components/MUIs'

const SortFilter = (props: any) => {
  const { config, resetFilterFn, sortFilterFn } = props

  const [companySizes, setCompanySizes] = useState([])
  const [industry, setIndustry] = useState([])
  const [filterLocation, setFilterLocation] = useState<any>('')
  const [financingStages, setFinancingStages] = useState([])

  const companySizeList =
    config.company_sizes.map?.((item) => ({
      ...item,
      value: item?.['seo-value'],
      label: item.value
    })) ?? []

  const industryList =
    config.industry_lists.map?.((item) => ({
      ...item,
      value: item?.['seo-value'],
      label: item.value
    })) ?? []

  const financingStageList =
    config.company_financing_stage_lists?.map?.((item) => ({
      ...item,
      value: item?.['key'],
      label: item?.value
    })) ?? []

  const handleReset = () => {
    resetFilterFn && resetFilterFn()
    setCompanySizes([])
    setIndustry([])
    setFilterLocation('')
    setFinancingStages([])
  }

  const handleQueries = () => {
    const company_size_ids = getIdByValue(companySizes, companySizeList, 'seo-value')
    const financingStages_ids = getIdByValue(financingStages, financingStageList, 'key')
    const industry_ids = getIdByValue(industry, industryList, 'seo-value')
    const location_ids = filterLocation?.id ? filterLocation?.id + '' : ''
    return {
      company_size_ids: company_size_ids,
      financing_stage_ids: financingStages_ids,
      industry_ids: industry_ids,
      location_ids: location_ids
    }
  }

  useEffect(() => {
    const queries = handleQueries()
    sortFilterFn && sortFilterFn(queries)
  }, [companySizes, financingStages, industry, filterLocation])

  const getIdByValue = (val, list, key) => {
    if (!val) return ''
    const ids = []
    val.forEach((item) => {
      const res = list.filter((value) => value?.[key] === item)
      if (res.length > 0) {
        ids.push(res[0]?.id)
      }
    })
    return ids.join(',')
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.filters}>
        {/* company size */}
        <Multiple
          label='Company Size'
          value={companySizes}
          className={styles.filterItems}
          options={companySizeList}
          onSelect={setCompanySizes}
          defaultValue={companySizes}
        />
        {/* Financing stage */}
        <Multiple
          label='Financing stage'
          value={financingStages}
          className={styles.filterItems}
          options={financingStageList}
          onSelect={setFinancingStages}
          defaultValue={financingStages}
        />
        {/* Industry Type */}
        <Multiple
          label={'Industry Type'}
          value={industry}
          options={industryList}
          className={styles.filterItems}
          onSelect={setIndustry}
        />
        {/* Location */}
        <LocationField1
          className={styles.filterItems}
          height={'30px'}
          locationList={config.location_lists}
          value={filterLocation}
          width='100%'
          label={'Location'}
          onChange={(e, value) => {
            setFilterLocation(value)
          }}
          sx={{
            '.MuiPaper-root': {
              width: '300px',
              '.MuiAutocomplete-paper': {
                width: '300px'
              }
            }
          }}
        />
        {/* Rest Filter */}
        <Button className={styles.clearButton} variant='text' onClick={handleReset}>
          Reset Filter
        </Button>
      </div>
    </ThemeProvider>
  )
}

export default React.memo(SortFilter)
