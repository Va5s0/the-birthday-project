import React from "react"
import {
  collection,
  query,
  onSnapshot,
  FirestoreError,
} from "firebase/firestore"
import { Contact } from "models/contact"
import { db } from "firebase/fbConfig"
import Card from "./Card/index"
import { css } from "emotion"
import { getAuth } from "firebase/auth"

const Contacts = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [, setError] = React.useState<FirestoreError>()
  const auth = getAuth()
  const { currentUser } = auth

  const contactsRef = query(
    collection(db, `users/${currentUser?.uid}/contacts`)
  )

  React.useEffect(() => {
    if (currentUser == null) {
      setContacts([])
    }
    return onSnapshot(
      contactsRef,
      (snapshot) => {
        const _contacts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setContacts(_contacts)
      },
      (err) => {
        setError(err)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  return (
    <div className={styles.container}>
      {contacts?.map((contact, idx) => (
        <Card key={idx} contact={contact} />
      ))}
    </div>
  )
}

export default Contacts

const styles = {
  container: css`
    display: flex;
    grid-column-gap: 30px;
    grid-row-gap: 30px;
    flex-wrap: wrap;
  `,
}
