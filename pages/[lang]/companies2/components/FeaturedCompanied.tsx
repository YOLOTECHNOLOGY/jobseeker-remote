import React from 'react'
import Text from 'components/Text'
import FeaturedCompany from './FeaturedCompany'
import BannerCarousel from 'components/BannerCarousel'
import styles from '../Companies.module.scss'

interface IProps {
  featuredCompany: object;
  langKey: string;
  featureBanners: any[];
  lang: any;
}

const FeaturedCompanied = (props: IProps) => {
  const { langKey, featuredCompany, featureBanners, lang } = props
  return (
    <>
      <Text textStyle='xxl' tagName='h2' bold className={styles.featuredSectionTitle}>
        {lang.companies.employer.title}
      </Text>
      <div className={styles.featuredEmployer}>
        <FeaturedCompany featuredCompany={featuredCompany} langKey={langKey} />
        <BannerCarousel slides={featureBanners} />
      </div>
    </>
  )
}

export default FeaturedCompanied
