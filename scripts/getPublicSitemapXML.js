export const getPublicSitemapXML = (response) => {
  const config = response.data.data

  let locationList
  let categoryList
  let industryList
  let qualificationList
  let experienceList
  let jobTypeList
  let salaryList = []

  if (config) {
    locationList =
      config &&
      config.location_lists
        .map((region) =>
          region.locations.map((loc) => ({
            ...loc,
            value: loc?.value,
            // loc value all lower case
            valueLowerCase: loc?.value.toLowerCase()
          }))
        )
        .reduce((a, c) => a.concat(c), [])
        .sort((a, b) => a.value.localeCompare(b.value))

    categoryList =
      config &&
      config.job_category_lists &&
      config.job_category_lists.map((category) => {
        return {
          key: category.key,
          label: category.value,
          value: category.value,
          sub_list: category.sub_list.map((sub) => {
            return {
              key: sub.key,
              label: sub.value,
              value: sub.value
            }
          })
        }
      })

    industryList =
      config &&
      config.industry_lists.map((industry) => ({
        key: industry['seo-value'],
        label: Object.values(industry)[0],
        value: Object.values(industry)[0]
      }))

    qualificationList =
      config &&
      config.educations &&
      Object.values(config.educations).map((degree) => {
        return {
          key: degree['seo-value'],
          label: Object.values(degree)[0],
          value: Object.values(degree)[0]
        }
      })

    experienceList =
      config &&
      config.work_xps &&
      Object.values(config.work_xps).map((level) => {
        return {
          key: level['seo-value'],
          label: Object.values(level)[0],
          value: Object.values(level)[0]
        }
      })

    jobTypeList =
      config &&
      config.job_types &&
      Object.values(config.job_types).map((type) => {
        return {
          key: type['seo-value'],
          label: Object.values(type)[0],
          value: Object.values(type)[0]
        }
      })

    salaryList =
      config &&
      config.salary_range_filters &&
      Object.values(config.salary_range_filters).map((salary) => {
        return {
          key: salary['seo-value'],
          label: Object.values(salary)[0] === '10K - 30K' ? 'Below 30K' : Object.values(salary)[0],
          value: Object.keys(salary)[0]
        }
      })
  }

  const generateJobFilterPath = (param, priority) => {
    param = param.replace(/&/g, '&amp;')
    param = param.replace(/</g, '&lt;')
    const url = `https://bossjob.ph/jobs-hiring/${
      param ? param.replace(/\s+/g, '-').toLowerCase() : ''
    }-jobs`

    return `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>${priority}</priority>
        <changefreq>monthly</changefreq>
      </url>
    `
  }

  const generatePath = (path, priority, oldUrl = false) => {
    let url
    if (oldUrl) {
      url = `https://bossjob.com.ph${path}`
    } else {
      url = `https://bossjob.ph${path}`
    }

    return `<url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>${priority}</priority>
        </url>
      `.replace(/&/g, '&amp;')
  }

  const generateExternalPath = (path, priority) =>
    `
      <url>
        <loc>${path}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${priority}</priority>
      </url>
    `.replace(/&/g, '&amp;')

  return `<?xml version="1.0" encoding="utf-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      ${generatePath('/', 1.0)}
      ${generatePath('/jobs-hiring/job-search', 1.0)}
      ${locationList && locationList.map((loc) => generateJobFilterPath(loc?.value, 0.8)).join('')}
      ${categoryList && categoryList.map((cat) => generateJobFilterPath(cat.key, 0.8)).join('')}
      ${
        categoryList &&
        categoryList.map((cat) =>
          cat.sub_list.map((sub) => generateJobFilterPath(sub.key, 0.8)).join('')
        )
      }
      ${
        industryList &&
        industryList.map((industry) => generateJobFilterPath(industry.key, 0.8)).join('')
      }
      ${experienceList && experienceList.map((exp) => generateJobFilterPath(exp.key, 0.8)).join('')}
      ${
        qualificationList &&
        qualificationList
          .map((qualification) => generateJobFilterPath(qualification.key, 0.8))
          .join('')
      }
      ${
        jobTypeList &&
        jobTypeList.map((jobType) => generateJobFilterPath(jobType.key, 0.8)).join('')
      }
      ${salaryList && salaryList.map((salary) => generateJobFilterPath(salary.key, 0.8)).join('')}
      ${generatePath('/resumetemplate', 1.0)}
      ${generatePath('/bosspoints', 0.8, true)}
      ${generatePath('/register/jobseeker', 0.8)}
      ${generatePath('/register/employer', 0.8, true)}
      ${generatePath('/login/jobseeker', 0.8)}
      ${generatePath('/login/employer', 0.8, true)}
      ${generatePath('/employer', 0.8, true)}
      ${generatePath('/employer/post-a-job', 0.8, true)}
      ${generatePath('/employer#pricing', 0.8, true)}
      ${generatePath('/employer#partners', 0.8, true)}
      ${generatePath('/employer/bosshunt/agency', 0.8, true)}
      ${generatePath('/legal', 0.8, true)}
      ${generatePath('/support', 0.8, true)}
      ${generateExternalPath('https://blog.bossjob.ph/', 0.8)}
      ${generateExternalPath('https://employer.bossjob.com/', 0.8)}
      ${generateExternalPath('https://employer.bossjob.com/get-started', 0.8)}
      ${generatePath('/companies', 0.8)}
      ${generatePath('/companies/search', 0.8)}
      </urlset>`
}
