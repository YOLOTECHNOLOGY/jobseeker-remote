// const ads = {
//   'homepage/rectangle-banner-1': {
//     id: '1648627236189-0',
//     adUnit: 'jobseeker//homepage//rectangle-banner-1',
//     sizes: [[300, 250]],
//   },
//   'homepage/rectangle-banner-2': {
//     id: '1648627339226-0',
//     adUnit: 'jobseeker//homepage//rectangle-banner-2',
//     sizes: [[300, 250]],
//   },
//   'job-detail/square-banner-1': {
//     id: '1656991688497-0',
//     adUnit: 'jobseeker//job-detail//square-banner-1',
//     sizes: [[340, 250]],
//   },
//   'jobs-search/skyscraper-1': {
//     id: '1650616245622-0',
//     adUnit: 'jobseeker//jobs-search//skyscraper-1',
//     sizes: [[160, 600]],
//   },
//   'jobs-search/skyscraper-2': {
//     id: '1648628019711-0',
//     adUnit: 'jobseeker//jobs-search//skyscraper-2',
//     sizes: [[160, 600]],
//   },
//   'jobs-search/skyscraper-3': {
//     id: '1648628050145-0',
//     adUnit: 'jobseeker//jobs-search//skyscraper-3',
//     sizes: [[160, 600]],
//   },
// }

const ads = {
  ph: {
    'homepage/rectangle-banner-1': {
      id: '1689911958259-0',
      adUnit: 'jobseeker//homepage//rectangle-banner-1',
      sizes: [[300, 250]],
    },
    'homepage/rectangle-banner-2': {
      id: '1689912003184-0',
      adUnit: 'jobseeker//homepage//rectangle-banner-2',
      sizes: [[300, 250]],
    },
    'job-detail/square-banner-1': {
      id: '1689913302285-0',
      adUnit: 'jobseeker//job-detail//square-banner-1',
      sizes: [[340, 250]],
    },
  },
  sg: {
    'homepage/rectangle-banner-1': {
      id: '1689912263889-0',
      adUnit: 'sg//jobseeker//homepage//rectangle-banner-1',
      sizes: [[300, 250]],
    },
    'homepage/rectangle-banner-2': {
      id: '1689912283918-0',
      adUnit: 'SG//jobseeker//homepage//rectangle-banner-2',
      sizes: [[300, 250]],
    },
    'job-detail/square-banner-1': {
      id: '1689913334397-0',
      adUnit: 'SG//jobseeker//job-detail//square-banner-1',
      sizes: [[340, 250]],
    },
  },
  jp: {
    'homepage/rectangle-banner-1': {
      id: '1689913160792-0',
      adUnit: 'JP//jobseeker//homepage//rectangle-banner-1',
      sizes: [[300, 250]],
    },
    'homepage/rectangle-banner-2': {
      id: '1689913200020-0',
      adUnit: 'JP//jobseeker//homepage//rectangle-banner-2',
      sizes: [[300, 250]],
    },
    'job-detail/square-banner-1': {
      id: '1689913349373-0',
      adUnit: 'JP//jobseeker//job-detail//square-banner-1',
      sizes: [[340, 250]],
    },
  },
  id: {
    'homepage/rectangle-banner-1': {
      id: '1689913241591-0',
      adUnit: 'ID//jobseeker//homepage//rectangle-banner-1',
      sizes: [[300, 250]],
    },
    'homepage/rectangle-banner-2': {
      id: '1689913252786-0',
      adUnit: 'ID//jobseeker//homepage//rectangle-banner-2',
      sizes: [[300, 250]],
    },
    'job-detail/square-banner-1': {
      id: '1689913364328-0',
      adUnit: 'ID//jobseeker//job-detail//square-banner-1',
      sizes: [[340, 250]],
    },
  }
}
function getDefaultValue() {
  return {
    id: '1689911958259-0',
    adUnit: 'jobseeker//homepage//rectangle-banner-1',
    sizes: [[300, 250]]
  }
}
function getAdForCountry(countryKey, adSlot) {
  // 检查 ads 对象是否包含国家键
  if (ads.hasOwnProperty(countryKey)) {
    // 检查 countryKey 对象是否有所需的广告类型
    if (ads[countryKey].hasOwnProperty(adSlot)) {
      // 如果有，返回该广告配置
      return ads[countryKey][adSlot];
    }
  }
  // 如果国家键或广告类型不存在，返回一个默认广告
  return getDefaultValue();
}
export default getAdForCountry
