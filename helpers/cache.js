import { memoizeWith } from 'ramda'

export const memoizeWithTime = (fn, makeKey, time = 60) => {
    let lastStamp = new Date().getTime()
    let cache = memoizeWith(makeKey)(fn)
    return (...args) => {
        const currentStamp = new Date().getTime()
        if (currentStamp - lastStamp > time * 1000) {
            console.log('reload', { time, passed: currentStamp - lastStamp })
            lastStamp = currentStamp
            cache = memoizeWith(makeKey)(fn)
        }
        return cache(...args)
    }
}