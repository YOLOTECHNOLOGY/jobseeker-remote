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

const VIf = props => props.show ? props.children : null

const FeaturedCompanied = (props: IProps) => {
  const { langKey, featuredCompany, featureBanners, lang } = props
  return (
    <VIf show={featuredCompany || featureBanners?.length > 0}>
      <div className={styles.featuredCompanyWrapper}>
        <div className={styles.featuredCompanyMain}>
          <h2 className={styles.featuredSectionTitle}>{lang.companies.employer.title}</h2>
          <div className={styles.featuredEmployer}>
            <FeaturedCompany featuredCompany={featuredCompany} langKey={langKey} />
            <BannerCarousel slides={featureBanners} />
          </div>
        </div>
      </div>
    </VIf>
  )
}

export default FeaturedCompanied
