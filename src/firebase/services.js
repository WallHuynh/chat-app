import { db } from './config'
import {
  collection,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  getDoc,
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

export const deleteDocument = async (oneCollection, oneDocument) => {
  const docRef = doc(db, oneCollection, oneDocument)
  await deleteDoc(docRef)
}

export const getDocument = async (oneCollection, oneDocument) => {
  const docRef = doc(db, oneCollection, oneDocument)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('No such document!')
  }
}

export const updateDocument = async (oneCollection, docId, data) => {
  const docRef = doc(db, oneCollection, docId)
  await updateDoc(docRef, data)
}

export const addDocument = async (oneCollection, data) => {
  let docRef
  switch (oneCollection) {
    case 'users':
      docRef = doc(db, oneCollection, data.uid)
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
      })
      break
    case 'status':
      docRef = doc(
        db,
        oneCollection,
        `${data.requestUser.uid}-${data.receiveUid}`
      )
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
      })
      break
    default:
      docRef = collection(db, oneCollection)
      const docSnap = await addDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
      })
      return docSnap
  }
}

export const userRegister = async user => {
  const queryUser = query(
    collection(db, 'users'),
    where('email', '==', user.email)
  )
  let isAlreadyAddUser = true
  const userRef = await getDocs(queryUser)
  userRef.forEach(doc => {
    isAlreadyAddUser = doc.data().email !== user.email
  })
  if (isAlreadyAddUser) {
    addDocument('users', {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      friends: [],
      requestedTo: [],
      pinnedRoomsId: [],
      coverPhotoURL:
        'https://firebasestorage.googleapis.com/v0/b/chat-app-5947f.appspot.com/o/cover-avt%2Fphoto-1501785888041-af3ef285b470.jpg?alt=media&token=812cd6c3-72eb-49b0-93aa-392af38278f9',
      providerId: user.providerData[0].providerId,
      keywords: generateKeywords(user.displayName?.toLowerCase()),
    })
  }
}

// tao keywords cho displayName, su dung cho search
export const generateKeywords = displayName => {
  // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
  // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
  const name = displayName.split(' ').filter(word => word)

  const length = name.length
  let flagArray = []
  let result = []
  let stringArray = []

  /**
   * khoi tao mang flag false
   * dung de danh dau xem gia tri
   * tai vi tri nay da duoc su dung
   * hay chua
   **/
  for (let i = 0; i < length; i++) {
    flagArray[i] = false
  }

  const createKeywords = name => {
    const arrName = []
    let curName = ''
    name.split('').forEach(letter => {
      curName += letter
      arrName.push(curName)
    })
    return arrName
  }

  function findPermutation(k) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true
        result[k] = name[i]

        if (k === length - 1) {
          stringArray.push(result.join(' '))
        }

        findPermutation(k + 1)
        flagArray[i] = false
      }
    }
  }

  findPermutation(0)

  const keywords = stringArray.reduce((acc, cur) => {
    const words = createKeywords(cur)
    return [...acc, ...words]
  }, [])

  return keywords
}
