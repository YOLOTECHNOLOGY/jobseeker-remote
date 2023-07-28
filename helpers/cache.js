import { memoizeWith } from 'ramda'
import { languages } from './country'

export const memoizeWithTime = (fn, makeKey, time = 60) => {
    let lastStamp = new Date().getTime()
    let cache = memoizeWith(makeKey)(fn)
    return (...args) => {
        const currentStamp = new Date().getTime()
        if (currentStamp - lastStamp > time * 1000) {
            lastStamp = currentStamp
            cache = memoizeWith(makeKey)(fn)
        }
        return cache(...args)
    }
}

export const withLanguages = params => {
    return languages.map(item => item.value)
        .map(lang => params.map(param => ({ ...param, lang })))
        .reduce((a, b) => a.concat(b), [])
}