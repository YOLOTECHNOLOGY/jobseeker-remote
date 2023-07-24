/* eslint-disable no-invalid-this */

export const recordTime = name => {
    const startTimeStamp = new Date().getTime()

    return () => {
        const endTimeStamp = new Date().getTime()
        console.log(`时间记录：${name}`, endTimeStamp - startTimeStamp)
        const cache = getGlobalCache(name)
        cache.push({
            startTimeStamp,
            endTimeStamp,
            duration: endTimeStamp - startTimeStamp
        })
    }
}

export class LimitedQueue {
    limited
    wrapped
    static queue = (limited = 200, initData = []) => new LimitedQueue(limited, initData)
    constructor(limited, data = []) {
        this.limited = limited
        this.wrapped = data
    }
    push = item => {
        while (this.wrapped.length > this.limited) {
            const [, ...tail] = this.wrapped
            this.wrapped = tail
        }
        this.wrapped = [...this.wrapped, item]
    }
    array = () => [...this.wrapped]
}

export const getGlobalCache = queueName => {
    if (!globalThis.recordCache) {
        globalThis.recordCache = {}
    }
    if (!globalThis.recordCache[queueName]) {
        globalThis.recordCache[queueName] = LimitedQueue.queue(200)
    }
    return globalThis.recordCache[queueName]
}