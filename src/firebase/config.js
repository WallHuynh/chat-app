import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const app = initializeApp({
  apiKey: 'AIzaSyBYuRhBug1Dr1rIIT5MgO4rLb28g0xvkmM',
  authDomain: 'chat-app-5947f.firebaseapp.com',
  projectId: 'chat-app-5947f',
  storageBucket: 'chat-app-5947f.appspot.com',
  messagingSenderId: '364878309585',
  appId: '1:364878309585:web:922f034eed8fbab14efdf0',
  measurementId: 'G-18RL1HZH4J',
})
getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)

// if (window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099')
//   connectFirestoreEmulator(db, 'localhost', 8080)
// }

export { db, auth }
