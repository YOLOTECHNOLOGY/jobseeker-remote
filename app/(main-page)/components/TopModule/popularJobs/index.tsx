'use client'
import React, { useContext, useMemo } from 'react'
import Link from 'app/components/Link'
import styles from 'app/index.module.scss'

import { LocationContext } from 'app/components/providers/locationProvier'
import { buildQuery } from 'app/(main-page)/helper'
import { languageContext } from 'app/components/providers/languageProvider'

const PopularJob = ({ langKey }: any) => {
  const { location } = useContext(LocationContext)
  const { home } = useContext(languageContext) as any

  const tags = [
    { value: home.tag.java, label: home.tag.java },
    { value: home.tag.full, label: home.tag.full },
    { value: home.tag.web, label: home.tag.web },
    { value: home.tag.cs, label: home.tag.cs },
    { value: home.tag.accountant, label: home.tag.accountant },
    { value: home.tag.sales, label: home.tag.sales }
  ]
  const querys = useMemo(() => {
    return tags.map((tag) => buildQuery(location?.seo_value, tag.value))
  }, [location, tags])

  return (
    <div className={styles.popularJobs}>
      <div className={styles.popularBox}>
      <label>{home.popularJobs}</label>
      <div className={styles.tagContainer}>
        {tags.map((tag, index) => (
          <Link
            key={tag.value}
            prefetch={false}
            href={'/' + langKey + querys[index]}
            className={styles.tag}
          >
            <div >
              {tag.label}
            </div>
          </Link>
        ))}
      </div>
      </div>
    </div>
  )
}

export default PopularJob as any
