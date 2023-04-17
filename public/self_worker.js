self.addEventListener('notificationclick', e => {
  console.log('notificationclick', e)
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const client = clients?.[0]
      if (client) {
        client.focus()
        client.postMessage({
          type: 'redirect',
          link: e?.notification?.data?.FCM_MSG?.notification?.click_action
        })
      }
      // else {
      //   client.postMessage({ type: 'redirect', link: 'https://www.google.com' })
      // }
    })
  )
})

importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js')
firebase.initializeApp({
  apiKey: 'AIzaSyDcvw3JBG8PPTQsppvPdkn39378fSBtF9g',
  authDomain: 'bossjob2021-6b1d7.firebaseapp.com',
  projectId: 'bossjob2021-6b1d7',
  storageBucket: 'bossjob2021-6b1d7.appspot.com',
  messagingSenderId: '640891885977',
  appId: '1:640891885977:web:5c45a6a3c1b8d24eeadb08',
  measurementId: 'G-V6JBNRJMFL'
})
const messaging = firebase.messaging()
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload, messaging, self)
  self.clients.matchAll({ type: 'window' }).then(clients => {
    const client = clients?.[0]
    if (client) {
      client.postMessage({
        type: 'receivedMessage',
        data: payload.data,
      })
    }
  })
})
