import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const app = initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
})
getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)

// if (window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099')
//   connectFirestoreEmulator(db, 'localhost', 8080)
// }

export { db, auth }
