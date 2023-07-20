import React, { useMemo } from 'react'
import styles from '../Companies.module.scss'
import Text from 'components/Text'
import Link from 'components/Link'
import Image from 'next/image'
import { CompanyVerifiedIcon } from 'images'
import { getValueById } from 'helpers/config/getValueById'

interface IProps {
  featuredCompany: any
  langKey: string
  config: any
}

const translatedCompany = (config, company) => {
  if (!config || !company) return company
  const financingStageValue =
    getValueById(config, company?.financing_stage_id, 'company_financing_stage_id') ||
    company?.financing_stage

  const companySizeValue =
    getValueById(config, company?.company_size_id, 'company_size_id') || company?.company_size

  const industryValue =
    getValueById(config, company?.industry_id, 'industry_id') || company?.industry

  return { financingStageValue, companySizeValue, industryValue }
}

const FeaturedCompany = (props: IProps) => {
  const { featuredCompany, langKey, config } = props

  const companyAbout = useMemo(() => {
    if (!featuredCompany) return []
    const { financingStageValue, companySizeValue, industryValue } = translatedCompany(
      config,
      featuredCompany
    )
    return [financingStageValue, companySizeValue, industryValue].filter(Boolean)
  }, [featuredCompany])

  return (
    <>
      {featuredCompany ? (
        <div className={styles.featuredCompany}>
          {/* company logo */}
          <div className={styles.featuredCompanyLogo}>
            <Link
              to={'/' + langKey + featuredCompany?.company_url || '/'}
              className={styles.featuredCompanyLogoLink}
              target='_blank'
            >
              {featuredCompany?.logo && (
                <Image
                  fill={true}
                  src={featuredCompany?.logo}
                  alt={`${featuredCompany?.name} logo`}
                />
              )}
            </Link>
          </div>

          {/* company details */}
          <div className={styles.featuredCompanyDetails}>
            {/* company name */}
            <Text textStyle='xl' bold className={styles.featuredCompanyNameWrapper}>
              <Link
                to={'/' + langKey + featuredCompany?.company_url || '/'}
                className={styles.featuredCompanyName}
                title={featuredCompany?.name}
                target='_blank'
              >
                {featuredCompany?.name}
              </Link>
              {featuredCompany?.is_verify ? (
                <Image src={CompanyVerifiedIcon} width={16} height={16} alt={'Verified'} />
              ) : null}
            </Text>

            {/* company about */}
            <div className={styles.featuredCompanyAbout}>
              {companyAbout.length > 0 &&
                companyAbout.map((item, index) => (
                  <Text key={index} textStyle='sm' className={styles.featuredCompanyAboutItem}>
                    {item}{' '}
                    <span
                      className={
                        index != companyAbout.length - 1
                          ? styles.featuredCompanyAboutItemSeparator
                          : ''
                      }
                    ></span>
                  </Text>
                ))}
            </div>

            {/* company description */}
            <p className={styles.featuredCompanyDescription}>
              {featuredCompany?.short_description}
            </p>

            {/* company photos */}
            <div className={styles.featuredCompanyPhotos}>
              {featuredCompany?.pictures?.length > 0 &&
                featuredCompany.pictures.slice(0, 3).map((item) => (
                  <div key={item.id} className={styles.featuredCompanyPhoto}>
                    <Image fill={true} src={item.url} alt={`${featuredCompany?.name} photo`} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.featuredCompany} />
      )}
    </>
  )
}

export default FeaturedCompany
