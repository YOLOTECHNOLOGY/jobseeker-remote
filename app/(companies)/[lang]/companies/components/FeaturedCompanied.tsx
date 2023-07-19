import React from 'react'
import FeaturedCompany from './FeaturedCompany'
import BannerCarousel from './BannerCarousel'
import styles from '../Companies.module.scss'

interface IProps {
  featuredCompany: object
  langKey: string
  featureBanners: any[]
  lang: any
  config: any
}

const VIf = (props) => (props.show ? props.children : null)

const FeaturedCompanied = (props: IProps) => {
  const { langKey, featuredCompany, featureBanners, lang, config } = props
  return (
    <VIf show={featuredCompany || featureBanners?.length > 0}>
      <div className={styles.featuredCompanyWrapper}>
        <div className={styles.featuredCompanyMain}>
          <h2 className={styles.featuredSectionTitle}>{lang.companies.employer.title}</h2>
          <div className={styles.featuredEmployer}>
            <FeaturedCompany featuredCompany={featuredCompany} config={config} langKey={langKey} />
            <BannerCarousel slides={featureBanners} />
          </div>
        </div>
      </div>
    </VIf>
  )
}

export default FeaturedCompanied
