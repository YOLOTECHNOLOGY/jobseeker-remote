const redirectionPaths = [
  {
    source: '/jobs-hiring',
    destination: '/jobs-hiring/job-search',
    permanent: false
  },
  {
    source: '/jobs-hiring/',
    destination: '/jobs-hiring/job-search',
    permanent: false
  },
  {
    source: '/jobs',
    destination: '/jobs-hiring/job-search',
    permanent: false
  },
  {
    source: '/jobs/',
    destination: '/jobs-hiring/job-search',
    permanent: false
  },
  {
    source: '/:lang/company/:keyword/jobs',
    destination: '/:lang/company/:keyword?tab=jobs',
    permanent: false
  }
]

module.exports = redirectionPaths
