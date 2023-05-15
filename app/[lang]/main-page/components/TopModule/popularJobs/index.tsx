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
    { value: 'Java Developer', label: home.tag.java },
    { value: 'Full Stack Engineer', label: home.tag.full },
    { value: 'Web Developer', label: home.tag.web },
    { value: 'Customer Service', label: home.tag.cs },
    { value: 'Accountant', label: home.tag.accountant },
    { value: 'Sales Consultant', label: home.tag.sales }
  ]
  const querys = useMemo(() => {
    return tags.map((tag) => buildQuery(location?.value, tag.value))
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
