/* eslint-disable new-cap */
/* eslint-disable no-extend-native */
import { ReaderT } from 'fantasy-readers'
// derived promise to monad
Promise.of = x => Promise.resolve(x)
Promise.prototype.map = function (f) {
    return this.then(f)
}
Promise.prototype.chain = function (f) {
    return this.then(f)
}


export const ReaderTPromise = ReaderT(Promise)
ReaderTPromise.prototype.map = function (f) {
    return this.chain(x => {
        return ReaderTPromise.of(f(x))
    })
}
