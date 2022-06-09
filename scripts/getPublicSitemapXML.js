export const getPublicSitemapXML = (response) => {
  const config = response.data.data

  let locationList,
    categoryList,
    industryList,
    qualificationList,
    experienceList,
    jobTypeList,
    salaryList = []

  if (config) {
    locationList =
      config &&
      config.inputs.location_lists
        .map((region) => region.locations)
        .reduce((a, c) => a.concat(c), [])
        .sort((a, b) => a.value.localeCompare(b.value))

    categoryList =
      config &&
      config.inputs.job_category_lists &&
      config.inputs.job_category_lists.map((category) => {
        return {
          key: category.key,
          label: category.value,
          value: category.value,
        }
      })
    industryList =
      config &&
      config.inputs.industry_lists.map((industry) => ({
        label: Object.values(industry)[0],
        value: Object.values(industry)[0],
      }))
    qualificationList =
      config &&
      config.filters.educations &&
      Object.values(config.filters.educations).map((degree) => {
        return {
          label: Object.values(degree)[0],
          value: Object.values(degree)[0],
        }
      })
    experienceList =
      config &&
      config.filters.work_xps &&
      Object.values(config.filters.work_xps).map((level) => {
        return {
          label: Object.values(level)[0],
          value: Object.values(level)[0],
        }
      })

    jobTypeList =
      config &&
      config.inputs.job_types &&
      Object.values(config.inputs.job_types).map((type) => {
        return {
          label: Object.values(type)[0],
          value: Object.values(type)[0],
        }
      })

    salaryList =
      config &&
      config.filters.salary_range_filters &&
      Object.values(config.filters.salary_range_filters).map((salary) => {
        return {
          label: Object.values(salary)[0] === '10K - 30K' ? 'Below 30K' : Object.values(salary)[0],
          value: Object.keys(salary)[0],
        }
      })
  }

  const generateJobFilterPath = (type, param, priority) => {
    param = param.replace(/&/g, '&amp;')
    param = param.replace(/</g, '&lt;')
    const url =
      type === 'jobCategory' || type === 'jobLocation'
        ? `https://bossjob.ph/jobs-hiring/${
            param ? param.replace(/\s+/g, '-').toLowerCase() : ''
          }-jobs`
        : `https://bossjob.ph/jobs-hiring/?${type}=${param}`

    return `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>${priority}</priority>
        <changefreq>monthly</changefreq>
      </url>
    `
  }

  const generatePath = (path, priority) =>
    `
      <url>
        <loc>${`https://bossjob.ph${path}`}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${priority}</priority>
      </url>
    `.replace(/&/g, '&amp;')

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
      ${generatePath('/jobs-hiring/', 1.0)}
      ${
        locationList &&
        locationList.map((loc) => generateJobFilterPath('jobLocation', loc.value, 0.8)).join('')
      }
      ${
        categoryList &&
        categoryList.map((cat) => generateJobFilterPath('jobCategory', cat.key, 0.8)).join('')
      }
      ${
        industryList &&
        industryList
          .map((industry) => generateJobFilterPath('industry', industry.value, 0.8))
          .join('')
      }
      ${
        experienceList &&
        experienceList.map((exp) => generateJobFilterPath('experience', exp.value, 0.8)).join('')
      }
      ${
        qualificationList &&
        qualificationList
          .map((qualification) => generateJobFilterPath('education', qualification.value, 0.8))
          .join('')
      }
      ${
        jobTypeList &&
        jobTypeList.map((jobType) => generateJobFilterPath('jobType', jobType.value, 0.8)).join('')
      }
      ${
        salaryList &&
        salaryList.map((salary) => generateJobFilterPath('salary', salary.value, 0.8)).join('')
      }
      ${generatePath('/resumetemplate', 1.0)}
      ${generatePath('/bosspoints', 0.8)}
      ${generatePath('/register/jobseeker', 0.8)}
      ${generatePath('/register/employer', 0.8)}
      ${generatePath('/login', 0.8)}
      ${generatePath('/employer', 0.8)}
      ${generatePath('/employer/post-a-job', 0.8)}
      ${generatePath('/employer#pricing', 0.8)}
      ${generatePath('/employer#partners', 0.8)}
      ${generatePath('/employer/bosshunt/agency', 0.8)}
      ${generatePath('/legal', 0.8)}
      ${generatePath('/support', 0.8)}
      ${generatePath('/legal', 0.8)}
      ${generatePath('/legal', 0.8)}
      ${generateExternalPath('https://blog.bossjob.ph/', 0.8)}
      ${generateExternalPath('https://hunt.bossjob.ph', 0.8)}
      ${generateExternalPath('https://hunt.bossjob.ph/get-started', 0.8)}
    </urlset>`
}
