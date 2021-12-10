const ads = {
  'job-page-skyscraper-1': {
    id: '1616571164101-0',
    adUnit: 'job//skyscraper-1',
    sizes: [[160, 600]],
  },
  'job-page-skyscraper-2': {
    id: '1616571403858-0',
    adUnit: 'job//skyscraper-2',
    sizes: [[160, 600]],
  },
  'job-page-skyscraper-3': {
    id: '1616571511461-0',
    adUnit: 'job//skyscraper-3',
    sizes: [[160, 600]],
  },
  'job-list-mobile-banner': {
    id: '1616665741016-0',
    adUnit: 'job//mobile-banner-1',
    sizes: [[300, 100]],
    nested: true,
  },
  'job-list-mobile-banner-2': {
    id: '1616665852816-0',
    adUnit: 'job//mobile-banner-2',
    sizes: [[300, 100]],
    nested: true,
  },
  'job-pagination-mobile-banner': {
    id: '1616980861356-0',
    adUnit: 'job//mobile-banner-3',
    sizes: [[300, 100]],
  },
  'job-detail/top-leaderboard': {
    id: '1617694257146-0',
    adUnit: 'job-detail//leaderboard-1',
    sizes: [
      [728, 90],
      [300, 100],
      [970, 90],
    ],
    mapping: {
      0: [],
      // if device width is at least 375px, display ads dimension of 320x50
      375: [300, 100],
      728: [728, 90],
      1024: [970, 90],
    },
  },
  'dev-job-page-skyscraper-1': {
    id: '1626406050243-0',
    adUnit: 'dev-test//job//skyscraper-1',
    sizes: [[160, 600]],
  },
  'dev-job-list-mobile-banner': {
    id: '1626405900927-0',
    adUnit: 'dev-test//job//mobile-banner-1',
    sizes: [[300, 100]],
    nested: true,
  },
}

export default ads
