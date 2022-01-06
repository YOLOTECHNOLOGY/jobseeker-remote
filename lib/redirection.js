const redirectionPaths = [
  {
    source: '/jobs-hiring',
    destination: '/jobs-hiring/job-search',
    permanent: false,
  },
  {
    source: '/jobs-hiring/',
    destination: '/jobs-hiring/job-search',
    permanent: false,
  },
  {
    source: '/jobs',
    destination: '/jobs-hiring/job-search',
    permanent: false,
  },
  {
    source: '/jobs/',
    destination: '/jobs-hiring/job-search',
    permanent: false,
  },
]

module.exports = redirectionPaths
