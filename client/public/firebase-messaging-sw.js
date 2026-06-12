importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyCzQ8w0fG7GvesH7hMdYBaLJfgQGADwPeM',
  authDomain: 'strawby-548b5.firebaseapp.com',
  projectId: 'strawby-548b5',
  storageBucket: 'strawby-548b5.firebasestorage.app',
  messagingSenderId: '413731395744',
  appId: '1:413731395744:web:e2f3c4cf6b1fd758a651c5',
  measurementId: 'G-C4X3J812T0',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {}

  self.registration.showNotification( title , {
    body,
    icon: '/logo.png',
  })
})
