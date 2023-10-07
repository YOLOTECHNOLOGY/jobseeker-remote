'use client'

import React, { useEffect } from 'react'
import styles from 'app/index.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { fetchFeaturedRemoteCompanies } from 'store/services/companies2/fetchCompanyRemote'

const Index = async ({ langKey }) => {
  //  const data = await fetchFeaturedRemoteCompanies()
  let data = []
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchFeaturedRemoteCompanies()
      console.log(result.data.data.featured_companies, 8888)
      data = result.data.data.featured_companies
    }
    fetchData()
  }, [])

  return (
    <div className={styles.guide}>
      <h2>Remote Job Guide</h2>
      <div className={styles.item}>
        <a href='###'>
          <Image
            width={160}
            height={100}
            alt=''
            src={
              'https://assets.bossjob.com/companies/27892/album-pictures/9fadc919bb2d0c2fa6c373ed0d2f2fde.jpeg'
            }
          ></Image>
          <div className={styles.content}>
            <h5>Lorem ipsum dolor simetpaLorem ipsum dolor </h5>
            <p>
              “Grammarly allows me to get those communications out and feel confident that I’m
              putting my best foot forward. Grammarly is like a little superpower, especially when I
              need to be at 110%.”
            </p>
          </div>
        </a>
      </div>
      <div className={styles.item}>
        <a href='###'>
          <Image
            width={160}
            height={100}
            alt=''
            src={
              'https://assets.bossjob.com/companies/27892/album-pictures/9fadc919bb2d0c2fa6c373ed0d2f2fde.jpeg'
            }
          ></Image>
          <div className={styles.content}>
            <h5>Lorem ipsum dolor simetpaLorem ipsum dolor </h5>
            <p>
              “Grammarly allows me to get those communications out and feel confident that I’m
              putting my best foot forward. Grammarly is like a little superpower, especially when I
              need to be at 110%.”
            </p>
          </div>
        </a>
      </div>
      <div className={styles.item}>
        <a href='###'>
          <Image
            width={160}
            height={100}
            alt=''
            src={
              'https://assets.bossjob.com/companies/27892/album-pictures/9fadc919bb2d0c2fa6c373ed0d2f2fde.jpeg'
            }
          ></Image>
          <div className={styles.content}>
            <h5>Lorem ipsum dolor simetpaLorem ipsum dolor </h5>
            <p>
              “Grammarly allows me to get those communications out and feel confident that I’m
              putting my best foot forward. Grammarly is like a little superpower, especially when I
              need to be at 110%.”
            </p>
          </div>
        </a>
      </div>
      <div className={styles.item}>
        <a href='###'>
          <Image
            width={160}
            height={100}
            alt=''
            src={
              'https://assets.bossjob.com/companies/27892/album-pictures/9fadc919bb2d0c2fa6c373ed0d2f2fde.jpeg'
            }
          ></Image>
          <div className={styles.content}>
            <h5>Lorem ipsum dolor simetpaLorem ipsum dolor </h5>
            <p>
              “Grammarly allows me to get those communications out and feel confident that I’m
              putting my best foot forward. Grammarly is like a little superpower, especially when I
              need to be at 110%.”
            </p>
          </div>
        </a>
      </div>

      <Link prefetch={true} href={'/' + langKey + '/companies'} className={styles.viewMore}>
        View More
      </Link>
    </div>
  )
}

export default Index
