import React from 'react'
import Text from 'components/Text'
import FeaturedCompany from './FeaturedCompany'
import BannerCarousel from 'components/BannerCarousel'
import styles from '../Companies.module.scss'

const FeaturedCompanied = (props: any) => {
  const { langKey, featuredCompany, featureBanners, lang } = props
  return (
    <>
      <Text textStyle='xxl' tagName='h2' bold className={styles.featuredSectionTitle}>
        {lang.companies.employer.title}
      </Text>
      <div className={styles.featuredEmployer}>
        <FeaturedCompany featuredCompany={featuredCompany} lang={lang} langKey={langKey} />
        <BannerCarousel slides={featureBanners} />
      </div>
    </>
  )
}

export default FeaturedCompanied
