import { ap, map } from 'fantasy-land'
import { ReaderT } from 'fantasy-readers'
//derived promise to monad

Promise.of = x => Promise.resolve(x)
Promise.prototype.map = function (f) {
  return this.then(f)
}
Promise.prototype.ap = function (a) {
  return this.then(f => a.then(f))
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
ReaderTPromise.do = function (f) {
  return ReaderTPromise(context => Promise.resolve().then(() => f(context)))
}

ReaderTPromise.prototype[map] = function (f) {
  return this.chain(x => {
    return ReaderTPromise.of(f(x))
  })
}
ReaderTPromise.prototype[ap] = function (a) {
  return this.chain(function (f) {
    return a.map(f)
  })
}
ReaderTPromise.prototype.andThen = function (a) {
  return this.chain(() => a)
}
ReaderTPromise.prototype.ap = function (a) {
  return this.chain(function (f) {
    return a.map(f)
  })
}
ReaderTPromise.prototype.catch = function (f) {
   return ReaderTPromise(context => this.run(context).catch(f))
}
// const commandLogger = command => {
//   if (process.env.NODE_ENV === 'development') {
//     console.log(`%c${command?.['@@tag']}`, 'color: orange', command?.['@@values'] ?? '')
//   }
//   return command
// }
ReaderTPromise.prototype.log = function (command) {
  if (process.env.NODE_ENV === 'development') {
    return ReaderTPromise(context => {
      console.log(`%c${command?.['@@tag']}`, 'color: blue', command?.['@@values'] ?? 'none')
      return this.run(context)
        .then(value => {
          console.log(`%c${'result:'}`, 'color: green', value ?? 'none')
          return value
        })
        .catch(error => {
          console.log(`%c${'error:'}`, 'color: red', error)
          return Promise.reject(error)
        })
    })
  } else {
    return this
  }
}
