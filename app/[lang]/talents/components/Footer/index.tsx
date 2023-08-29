/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useContext } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import Accordian from 'components/Accordian'
import Text from '../../../../../components/Text'
import QrCodeDraw from 'app/[lang]/get-started/components/QrCodeDraw'
import { languageContext } from 'app/components/providers/languageProvider'

import { appLinkUrl } from 'helpers/constants'
import { getAppStoreLink, getCountryKey } from 'helpers/country'
import { getCookie } from '../../../../../helpers/cookies'
import useWindowSize from '../../../../../hooks/useWindowSize'

import {
  footer_apple_download,
  footer_googleplay_download,
  FooterGalaxyAppStore,
  FooterHuaweiAppStore,
  FooterXiaomiAppStore
} from 'images'

import style from './index.module.scss'
import styles from '../../../../../components/Footer/Footer.module.scss'
import linkToHunt from 'helpers/linkToHunt'


const follow_use = [
  {
    img: `${process.env.S3_BUCKET_URL}/landing/facebook.svg`,
    link: 'https://www.facebook.com/Bossjobph'
  },
  {
    img: `${process.env.S3_BUCKET_URL}/landing/inlink.svg`,
    link: 'https://www.linkedin.com/company/bossjob-yolo-technology/'
  },
  {
    img: `${process.env.S3_BUCKET_URL}/landing/ins.svg`,
    link: 'https://www.instagram.com/Bossjobph'
  },
  {
    img: `${process.env.S3_BUCKET_URL}/landing/youtube.svg`,
    link: 'https://www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'
  },
  {
    img: `${process.env.S3_BUCKET_URL}/landing/twitter.svg`,
    link: 'https://twitter.com/BossjobOfficial'
  },
  { img: `${process.env.S3_BUCKET_URL}/landing/tiktok.svg`, link: 'https://tiktok.com/@bossjobph' }
]

const Footer = () => {
  const contextLang = useContext(languageContext)
  const isLogin = getCookie('accessToken') ? true : false

  const {
    about,
    aboutBossjob,
    termsConditions,
    legal,
    FAQ,
    talents,
    allJobs,
    createJobAlert,
    createFree,
    careerGuide,
    courses,
    recruiter,
    getStarted,
    popularJobs,
    ItJobs,
    financeJobs,
    customerService,
    BpoJobs,
    salesJobs,
    healthcareJobs,
    downloadBossjobApp,
    followUs,
    technology,
    corporation,
    JobsIn1,
    JobsIn2,
    JobsIn3,
    IndonesiaPT,
    JapanYolo,
    JapanAddress
    // @ts-ignore
  } = contextLang?.foot || {}
  const countryKey = getCountryKey()
  const COUNTRY_MAP = {
    ph: [
      {
        key: `/jobs-hiring/manila-jobs`,
        child: JobsIn1
      },
      {
        key: `/jobs-hiring/makati-jobs`,
        child: JobsIn2
      },
      {
        key: `/jobs-hiring/cebu-jobs`,
        child: JobsIn3
      }
    ],
    sg: [
      {
        key: `/jobs-hiring/downtown-core-jobs`,
        child: JobsIn1
      },
      {
        key: `/jobs-hiring/kallang-jobs`,
        child: JobsIn2
      },
      {
        key: `/jobs-hiring/jurong-east-jobs`,
        child: JobsIn3
      }
    ],
    jp: [],
    id: []
  }
  const colData = [
    {
      title: about,
      links: [
        {
          key: `/company/bossjob-1668`,
          child: aboutBossjob
        },
        {
          key: `${process.env.BLOG_BOSSJOB}/terms-and-conditions/`,
          child: termsConditions
        },
        {
          key: `${process.env.BLOG_BOSSJOB}/terms-and-conditions/`,
          child: legal
        },
        {
          key: `${process.env.BOSS_BLOG_URL}/category/faq/`,
          child: FAQ
        }
      ]
    },
    {
      title: talents,
      links: [
        {
          key: `/jobs-hiring/job-search`,
          child: allJobs
        },
        {
          key: `/jobs-hiring`,
          child: createJobAlert
        },
        {
          key: isLogin ? `/manage-profile?tab=resume` : `/resumetemplate`,
          child: createFree
        },
        {
          key: 'https://blog.bossjob.ph/category/career-advice/',
          child: careerGuide
        },
        {
          key: 'https://academy.bossjob.ph/courses/search-courses',
          child: courses
        }
      ]
    },
    {
      title: recruiter,
      links: [
        {
          key: linkToHunt(''),
          child: getStarted
        }
      ]
    },
    {
      title: popularJobs,
      links: [
        // ...currentCounties,
        {
          key: `/jobs-hiring/information-technology-jobs?page=1`,
          child: ItJobs
        },
        {
          key: `/jobs-hiring/finance-audit-tax-jobs?page=1`,
          child: financeJobs
        },
        {
          key: `/jobs-hiring/customer-service-operations-jobs?page=1`,
          child: customerService
        },
        {
          key: `/jobs-hiring/bpo-jobs`,
          child: BpoJobs
        },
        {
          key: `/jobs-hiring/sales-jobs?page=1`,
          child: salesJobs
        },
        {
          key: `/jobs-hiring/healthcare-medical-jobs?page=1`,
          child: healthcareJobs
        }
      ]
    }
  ]
  const { width } = useWindowSize()
  const isMobile = width < 540

  if (isMobile) {
    return (
      <div className={style.mobile_footer}>
        <div className={style.mobile_footer_container}>
          <div className={style.mobile_footer_title}>{downloadBossjobApp}</div>
          <div className={style.mobile_footer_download}>
            <div className={style.mobile_footer_download_appStore} >
              <Link href={getAppStoreLink()} target={'_blank'}>
                <Image src={footer_apple_download} alt='AppStore' width={140} height={42} />
              </Link>
              <Link href={process.env.GOOGLE_PLAY_STORE_LINK} target={'_blank'}>
                <Image src={footer_googleplay_download} alt='GooglePlay' width={140} height={42} />
              </Link>
              <Link href={process.env.GALAXY_APP_STORE_LINK} target={'_blank'}>
                <Image src={FooterGalaxyAppStore} alt='GalaxyStore' width={140} height={42} />
              </Link>
              <Link href={process.env.HUAWEI_APP_STORE_LINK} target={'_blank'}>
                <Image src={FooterHuaweiAppStore} alt='HuaweiStore' width={140} height={42} />
              </Link>
              <Link href={process.env.XIAOMI_APP_STORE_LINK} target={'_blank'}>
                <Image src={FooterXiaomiAppStore} alt='XiaomiStore' width={140} height={42} />
              </Link>
            </div>
          </div>
          <div className={style.mobile_list_container}>
            {colData.map((item, index) => {
              return (
                <Accordian
                  key={index}
                  paddedLine
                  paddedContent
                  dark
                  title={
                    <Text textStyle='sm' bold className={style.mobile_list_title}>
                      <span className={style.mobile_list_title}>{item.title}</span>
                    </Text>
                  }
                >
                  <ul className={styles.mobile_list}>
                    {item.links.map((link, index) => {
                      return (
                        <li key={index}>
                          <Link
                            className={style.mobile_footer_link}
                            href={link.key}
                            title={link.child}
                          >
                            <Text textStyle='sm'>{link.child}</Text>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </Accordian>
              )
            })}
          </div>
          <div className={style.mobile_follow_us}>
            <div className={style.site_map_title}>{followUs}</div>
            <div className={style.site_map_follow}>
              {follow_use.map((item, index) => {
                return (
                  <Link href={item.link} target={'_blank'} key={index}>
                    <img src={item.img} alt='img' />
                  </Link>
                )
              })}
            </div>
          </div>
          <div className={style.site_copy_right}>
            Copyright © {new Date().getFullYear()} {technology}
            <div style={{ marginTop: 10 }}>{corporation}</div>
            <p>{IndonesiaPT}</p>
            <p>
              {JapanYolo} <span>|</span>
              {JapanAddress}
            </p>
          </div>
        </div>
        <div className={style.mobile_bg_wrapper}>
          {/* <MySvgComponent></MySvgComponent> */}
          <img
            src={`${process.env.S3_BUCKET_URL}/landing/Mobile4-min.jpg`}
            alt={'bg'}
            className={style.mobile_bg}
          />
        </div>
      </div>
    )
  }
  return (
    <div className={style.footer_container}>
      <img
        src={`${process.env.S3_BUCKET_URL}/landing/Web4-min.jpg`}
        alt={'bg'}
        className={style.bg}
      />
      <div className={style.footer_title}>{downloadBossjobApp}</div>
      <div className={style.footer_download}>
        <div className={style.footer_download_appStore} >
          <Link href={getAppStoreLink()} target={'_blank'}>
            <Image src={footer_apple_download} alt='AppStore' width={140} height={42} />
          </Link>
          <Link href={process.env.GOOGLE_PLAY_STORE_LINK} target={'_blank'}>
            <Image src={footer_googleplay_download} alt='GooglePlay' width={140} height={42} />
          </Link>
          <Link href={process.env.GALAXY_APP_STORE_LINK} target={'_blank'}>
            <Image src={FooterGalaxyAppStore} alt='GalaxyStore' width={140} height={42} />
          </Link>
          <Link href={process.env.HUAWEI_APP_STORE_LINK} target={'_blank'}>
            <Image src={FooterHuaweiAppStore} alt='HuaweiStore' width={140} height={42} />
          </Link>
          <Link href={process.env.XIAOMI_APP_STORE_LINK} target={'_blank'}>
            <Image src={FooterXiaomiAppStore} alt='XiaomiStore' width={140} height={42} />
          </Link>
        </div>
        {/* <img
          className={style.qrcode}
          src={`${process.env.S3_BUCKET_URL}/landing/footer_download_qrcode.png`}
          alt='_'
        /> */}
        <div className={style.qrcode} >
          <QrCodeDraw text={appLinkUrl} ecl='H' width={88} height={88} />
        </div>
      </div>
      <div className={style.footer_site_map}>
        {colData.map((item, index) => {
          return (
            <div className={style.site_map_col} key={index}>
              <div className={style.site_map_title}>{item.title}</div>
              {item.links.map((_item, index) => {
                return (
                  <Link
                    className={style.site_map_link}
                    target={'_blank'}
                    href={_item.key}
                    key={index}
                  >
                    {' '}
                    {_item.child}
                  </Link>
                )
              })}
            </div>
          )
        })}
        <div className={style.site_map_col}>
          <div className={style.site_map_title}>{followUs}</div>
          <div className={style.site_map_follow}>
            {follow_use.map((item, index) => {
              return (
                <Link href={item.link} target={'_blank'} key={index}>
                  <img src={item.img} alt='img' />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <div className={style.site_copy_right}>
        Copyright © {new Date().getFullYear()} {technology}
        <p> {corporation}</p>
        <p>{IndonesiaPT}</p>
        <p>
          {JapanYolo}
          {/* <span>|</span> */}
          {/* {JapanAddress} */}
        </p>
      </div>
    </div>
  )
}

export default Footer
