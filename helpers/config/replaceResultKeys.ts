import { getValueById } from './getValueById'
import { map as ConfigMaps } from './getIdPath'
import { cloneDeep } from 'lodash-es'

export type TMapOfKey = keyof typeof ConfigMaps

export interface IReplaceResultKey {
    property: string; // old property
    idKey: string; // new property
    configKey: TMapOfKey; // config store of key
    defaultValue?: string; // if config store not find, use default value
    key?: string; // get find key of value from config store, default use 'value' key
}

export type TReplaceDataKeyMaps = IReplaceResultKey[]

export const findKeyItem = (map:TReplaceDataKeyMaps,property:string) => {
    return map.filter(item => {
      return item.property === property
    })
}


/**
 * Replace fetch data
 * @param {object} config store config object
 * @param {object} data fetch data object
 * @param {array} map array keys maps
 * @param {boolean} isClone deep clone of data object
 * @return {object} isClone is true, return new data object
 */
export const replaceResultKeys = (config: object, data: object, map: TReplaceDataKeyMaps, isClone = false) => {
    const result = isClone ? cloneDeep(data): data;
    // console.log('config store', config)
    const replace = (configs, obj) => {
        try {
            for (const property in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, property)) {
                    const value = obj[property]
                    if(typeof value === 'object') {
                        replace(configs, value)
                    }else {
                        const keyItem = findKeyItem(map, property)
                        if(keyItem.length > 0) {
                            const { idKey, configKey, key='value', defaultValue='' } = keyItem[0]
                            const idKeyValue = obj[idKey]
                            const hasConfigKey = Object.keys(ConfigMaps).includes(configKey)
                            // obj has idKey and ConfigMaps has configKey
                            if(idKeyValue && hasConfigKey) {
                                const getValue = getValueById(configs, idKeyValue, configKey, key)
                                // console.log('item', keyItem[0], idKeyValue, ConfigMaps[configKey], getValue)
                                obj[property] = getValue || defaultValue
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    replace(config, result)
    return result
}

/**
How to use example:

const keysMap: TReplaceDataKeyMaps = [
    {
      property: 'job_location',
      idKey: 'location_id',
      configKey: 'location_id'
    },
    {
      property: 'interview_result',
      idKey: 'interview_result_status_id',
      configKey: 'interview_result_status_id'
    },
    {
      property: 'job_application_status',
      idKey: 'job_application_status_id',
      configKey: 'job_application_status_id'
    }
  ]

  replaceResultKeys(configStore, responseData, keysMap)
 */
