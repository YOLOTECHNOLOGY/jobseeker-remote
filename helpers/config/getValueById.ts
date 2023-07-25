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
    return ''
  }

  return forEachObject(store, id, Array.isArray(path) ? path : path.split('.'))
}