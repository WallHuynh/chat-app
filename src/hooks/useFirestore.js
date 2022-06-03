import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  // limit,
  // doc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export default function useFirestore(someCollection, someCondition) {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    let collectionRef
    if (someCondition) {
      if (!someCondition.compareValue || !someCondition.compareValue.length) {
        setDocuments([])
        return
      }
      collectionRef = query(
        collection(db, someCollection),
        where(
          someCondition.fieldName,
          someCondition.operator,
          someCondition.compareValue
        ),
        orderBy('createdAt')
      )
    }

    const unsubscribe = onSnapshot(
      collectionRef,
      snapshot => {
        const documents = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))
        setDocuments(documents)
      },
      error => console.log(error)
    )

    return unsubscribe
  }, [someCollection, someCondition])

  return documents
}
