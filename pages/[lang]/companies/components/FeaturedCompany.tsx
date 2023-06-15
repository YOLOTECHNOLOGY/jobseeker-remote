import React, { useMemo } from 'react'
import styles from '../Companies.module.scss'
import Text from 'components/Text'
import Link from 'components/Link'
import Image from 'next/image'
import {CompanyVerifiedIcon} from 'images'

const FeaturedCompany = (props: any) => {
  const {
    featuredCompany,
    langKey,
  } = props

  const companyAbout = useMemo(() => {
    if(!featuredCompany) return []
    const {financing_stage='', company_size='', industry=''} = featuredCompany
    return [financing_stage, company_size, industry].filter(Boolean)
  }, [featuredCompany])

  return (
    <>
      {featuredCompany && (
        <div className={styles.featuredCompany}>
          {/* company logo */}
          <div className={styles.featuredCompanyLogo}>
            <Link to={'/' + langKey + featuredCompany?.company_url || '/'}>
              <Image
                width={64}
                height={64}
                src={featuredCompany?.logo}
                alt={`${featuredCompany?.name} logo`}
              />
            </Link>
          </div>

          {/* company details */}
          <div className={styles.featuredCompanyDetails}>
            {/* company name */}
            <Text textStyle='xl' bold>
              <Link
                to={'/' + langKey + featuredCompany?.company_url || '/'}
                className={styles.featuredCompanyName}
              >
                {featuredCompany?.name}
              </Link>
              {featuredCompany?.is_verify ? <Image src={CompanyVerifiedIcon} width={16} height={16} alt={'Verified'} /> : null}
            </Text>
            
            {/* company about */}
            <div className={styles.featuredCompanyAbout}>
              {
                companyAbout.length > 0 && (
                  companyAbout.map((item, index) => (
                    <Text key={index} textStyle='sm' className={styles.featuredCompanyAboutItem}>
                      {item} <span className={(index != companyAbout.length - 1) ? styles.featuredCompanyAboutItemSeparator : ''}></span>
                    </Text>
                  ))
                )
              }
            </div>

            {/* company description */}
            <Text textStyle='lg' tagName='p' className={styles.featuredCompanyDescription}>
              {featuredCompany?.short_description}
            </Text>

            {/* company photos */}
            <div className={styles.featuredCompanyPhotos}>
              {featuredCompany?.pictures?.length > 0 &&
                featuredCompany.pictures.slice(0,3).map((item) => (
                  <div key={item.id} className={styles.featuredCompanyPhoto}>
                    <Image
                      fill={true}
                      src={item.url}
                      alt={`${featuredCompany?.name} photo`}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FeaturedCompany
