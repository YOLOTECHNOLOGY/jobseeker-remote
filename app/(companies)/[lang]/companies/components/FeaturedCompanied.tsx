import React from 'react'
import Text from 'components/Text'
import FeaturedCompany from './FeaturedCompany'
import BannerCarousel from './BannerCarousel'
import styles from '../Companies.module.scss'

interface IProps {
  featuredCompany: object
  langKey: string
  featureBanners: any[]
  lang: any
}

const FeaturedCompanied = (props: IProps) => {
  const { langKey, featuredCompany, featureBanners, lang } = props
  return (
    <>
      <h2 className={styles.featuredSectionTitle}>{lang.companies.employer.title}</h2>
      <div className={styles.featuredEmployer}>
        <FeaturedCompany featuredCompany={featuredCompany} langKey={langKey} />
        <BannerCarousel slides={featureBanners} />
      </div>
    </>
  )
}

export default FeaturedCompanied
