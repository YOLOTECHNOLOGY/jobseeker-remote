// in some case, the target value's key isn't named value, likely label
import { getIdPath } from "./getIdPath";
export const getValueById = (store: Record<string, any>, id: any, idKey: string, key = 'value') => {
  const path = getIdPath(idKey) ?? []
  const getLastedValue = (object: { [k: string]: any }[] | { [k: string]: any }, id: any) => {
    let result;
    if (Array.isArray(object)) {
      object.find(item => {
        if (Array.isArray(item)) {
          throw new Error('the lasted value must is a plain object, but it is an array now')
        }
        if (item.id === id) {
          return result = item[key]
        }
      })
      return result
    }
    return object?.[key]
  }

  const forEachObject = (object: any, id: any, path: string[]) => {
    const pathArray = path;
    let currentObject = object;

    let result;
    pathArray.find((pathKey, index) => {
      const value = currentObject?.[pathKey]
      if (Array.isArray(value) && (index !== pathArray.length - 1)) {
        return result = forEachArray(value, id, pathArray.slice(index + 1))
      } else {
        currentObject = value;
      }
    })

    if (!result) {
      result = getLastedValue(currentObject, id)
    }

    return result
  }

  const forEachArray = (array: any[], id: any, paths: string[]) => {
    let result;
    if (paths.length) {
      array.find((item, index) => {
        if (Array.isArray(item)) {
          return result = forEachArray(item, id, paths.slice())
        } else {
          return result = forEachObject(item, id, paths.slice())
        }
      })
      return result
    }
    return getLastedValue(array, id)
  }
  if (id === null || id === undefined) {
    return null
  }

  return forEachObject(store, id, Array.isArray(path) ? path : path.split('.'))
}

// const data = {
//   location: [{
//     "id": 9,
//     "country_id": 167,
//     "key": "ncr",
//     "value": "NCR",
//     "display_name": "National Capital Region",
//     "sort_order": 1,
//     "seo_value": "national-capital-region",
//     "locations": [{
//       "id": 147,
//       "key": "bgc",
//       "value": "Bonifacio Global City",
//       "is_popular": false,
//       "region_display_name": "National Capital Region",
//       "seo_value": "bonifacio-global-city"
//     }, {
//       "id": 58,
//       "key": "caloocan",
//       "value": "Caloocan",
//       "is_popular": true,
//       "region_display_name": "National Capital Region",
//       "seo_value": "caloocan"
//     },]
//   }],
//   main: [{
//     "value": "Customer Service/Operations",
//     "key": "customer-service-operations",
//     "seo_value": "customer-service-operations",
//     "id": 0,
//     "children": [
//       {
//         "id": 21,
//         "value": "Customer Service",
//         "seo-value": "customer-service",
//         "job_titles": [{
//           "id": 148,
//           "value": "Customer Service Representative",
//           "is_featured": true,
//           "seo-value": "customer-service-representative"
//         }, {
//           "id": 151,
//           "value": "Online Customer Service Representative",
//           "is_featured": true,
//           "seo-value": "online-customer-service-representative"
//         }, {
//           "id": 152,
//           "value": "Call Center Representative",
//           "is_featured": true,
//           "seo-value": "call-center-representative"
//         }, {
//           "id": 155,
//           "value": "Call Center Representative",
//           "is_featured": true,
//           "seo-value": "call-center-representative"
//         }, {
//           "id": 149,
//           "value": "Customer Service Supervisor",
//           "is_featured": false,
//           "seo-value": "customer-service-supervisor"
//         }, {
//           "id": 150,
//           "value": "Customer Service Manager",
//           "is_featured": false,
//           "seo-value": "customer-service-manager"
//         }, {
//           "id": 153,
//           "value": "After Sales Customer Service Representative",
//           "is_featured": false,
//           "seo-value": "after-sales-customer-service-representative"
//         }, {
//           "id": 154,
//           "value": "Pre-Sales Customer Service Representative",
//           "is_featured": false,
//           "seo-value": "pre-sales-customer-service-representative"
//         }],
//         "skills": [{
//           "id": 12,
//           "value": "English Language",
//           "seo-value": "english-language"
//         }, {
//           "id": 36,
//           "value": "Customer Service",
//           "seo-value": "customer-service"
//         }, {
//           "id": 68,
//           "value": "Scheduling",
//           "seo-value": "scheduling"
//         }]
//       }, {
//         "id": 22,
//         "value": "Content Operations",
//         "seo-value": "content-operations",
//         "job_titles": [{
//           "id": 156,
//           "value": "Digital Media Operations Specialist",
//           "is_featured": false,
//           "seo-value": "digital-media-operations-specialist"
//         }, {
//           "id": 157,
//           "value": "Live Broadcast Operations Specialist",
//           "is_featured": false,
//           "seo-value": "live-broadcast-operations-specialist"
//         }],
//         "skills": []
//       }]
//   }]
// }

// export const test = () => {

//   console.log('datadata', getValueById(data, 58, 'location.locations'))

//   console.log('datadata', getValueById(data, 157, 'main.children.job_titles'))
//   console.log('datadata', getValueById(data, 21, 'main.children'))
//   console.log('datadata', getValueById(data, 68, 'main.children.skills'))
// }