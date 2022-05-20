const fs = require('fs')

const crawlableRobotsTxt = `
  User-agent: *
  Disallow:
  Sitemap: https://bossjob.ph/sitemap.xml
  Sitemap: https://bossjob.ph/job-sitemap.xml
  Sitemap: https://bossjob.ph/agencies.xml
  Sitemap: https://bossjob.ph/company-sitemap.xml
`
const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`
const generateRobotsTxt = () => {
  // Create a non-crawlable robots.txt in non-production environments

  const robotsTxt = process.env.ENV === 'production' ? crawlableRobotsTxt : uncrawlableRobotsTxt

  // Create robots.txt file
  fs.writeFileSync('public/robots.txt', robotsTxt)

  // eslint-disable-next-line no-console
  console.log(
    `Generated a ${
      process.env.ENV === 'production' ? 'crawlable' : 'non-crawlable'
    } public/robots.txt`
  )
}

module.exports = generateRobotsTxt
