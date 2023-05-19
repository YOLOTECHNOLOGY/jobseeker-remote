'use client'
import React, { useContext, useMemo } from 'react'
import Link from 'next/link'
import styles from 'app/[lang]/index.module.scss'

import { LocationContext } from 'app/[lang]/components/providers/locationProvier'
import { buildQuery } from 'app/[lang]/main-page/helper'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'

const PopularJob = () => {
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
      <label>{home.popularJobs}</label>
      <div className={styles.tagContainer}>
        {tags.map((tag, index) => (
          <div key={tag.value} className={styles.tag}>
            <Link prefetch={false} href={querys[index]}>
              {tag.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularJob as any
