import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken, isSupported } from "firebase/messaging";
const vapidKey = 'BPSNbeeP647k3y02pPIWBgh8qiEUywYXa0aY9WbZ_yGO6beOY8oah_CyL9Q1mojbtzdX4NJpVI83w149n0yyh7Y'
export const initFireBase = () => {
    isSupported().then(async supported => {
        if (!supported) {
            // alert('Notifications from bossjob is not supported on this browser!')
            return
        }
        try {
            const serviceWorkerRegistration = await navigator.serviceWorker.register('/self_worker.js',
                { scope: '/' })
                .then((reg) => {
                    console.log('ServiceWorker register success: ', reg)
                    return reg
                })
                .catch((err) => {
                    console.log('ServiceWorker register failed: ', err)
                    return Promise.reject(err)
                })
            await serviceWorkerRegistration.update()
            navigator.serviceWorker.addEventListener('message', e => {
                console.log({ onMessage: e })
                if (e?.data?.link) {
                    window.location.href = e.data.link
                }
            })
            navigator.serviceWorker.startMessages()
            const firebaseConfig = {
                apiKey: "AIzaSyDcvw3JBG8PPTQsppvPdkn39378fSBtF9g",
                authDomain: "bossjob2021-6b1d7.firebaseapp.com",
                projectId: "bossjob2021-6b1d7",
                storageBucket: "bossjob2021-6b1d7.appspot.com",
                messagingSenderId: "640891885977",
                appId: "1:640891885977:web:5c45a6a3c1b8d24eeadb08",
                measurementId: "G-V6JBNRJMFL"
            };
            const app = initializeApp(firebaseConfig)
            const messaging = getMessaging(app)

            getToken(messaging, { vapidKey, serviceWorkerRegistration })
                .then(token => {
                    sessionStorage.setItem('firebase-messaging-token', token)
                    window.firebaseMessagingToken = token
                    onMessage(messaging, (payload) => {
                        console.log('Message received. ', payload);
                        // ...
                    });
                }).catch(e => {
                    console.log('getTokenError', e)
                });
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                }
            }).catch(e => console.log(e))
        } catch (e) {
            console.log({ firebaseError: e })
        }
    })

}
