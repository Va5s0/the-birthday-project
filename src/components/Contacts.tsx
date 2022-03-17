import React from "react"
import {
  collection,
  query,
  onSnapshot,
  FirestoreError,
} from "firebase/firestore"
import { Contact } from "models/contact"
import { db } from "firebase/config"
import { useAuth } from "context/AuthContext"
import Card from "./Card/index"
import { css } from "emotion"

const Contacts = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [error, setError] = React.useState<FirestoreError>()

  const contactsRef = query(collection(db, "contacts"))

  const currentUser = useAuth()

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
      (err) => setError(err)
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
