import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from "firebase/messaging";
const vapidkey = 'BPSNbeeP647k3y02pPIWBgh8qiEUywYXa0aY9WbZ_yGO6beOY8oah_CyL9Q1mojbtzdX4NJpVI83w149n0yyh7Y'
export const initFireBase = () => {
    try {
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
        console.log({ app })
        const messaging = getMessaging(app)
        console.log({ messaging })
        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            // ...
        });
        getToken(messaging, { vapidKey: "BKagOny0KF_2pCJQ3m....moL0ewzQ8rZu" })
            .then(token => {
                console.log({ token })
            }).catch(e => {
                console.log('getTokenError', e)
            });
        Notification.requestPermission().then((permission) => {
            console.log({ permission })
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            }
        })
    } catch (e) {
        console.log({ firebaseError: e })
    }

}