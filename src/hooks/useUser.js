import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export default function useUser(aCollection, aDocument) {
  const [documents, setDocuments] = useState({})

  useEffect(() => {
    const unsub = onSnapshot(doc(db, aCollection, aDocument), doc => {
      setDocuments(doc.data())
    })
    return unsub
  }, [aCollection, aDocument])

  return documents
}
