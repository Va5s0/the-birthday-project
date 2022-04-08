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
import img from "assets/tree.jpeg"

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
    <>
      <div className={styles.container}>
        {contacts?.map((contact, idx) => (
          <Card key={idx} contact={contact} />
        ))}
      </div>
    </>
  )
}

export default Contacts

const styles = {
  container: css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 120px 35px 0;
    background-color: var(--light-grey-3);
    overflow: auto;
    min-height: calc(100vh - 70px);
    @media (max-width: 1461px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 1009px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 557px) {
      grid-template-columns: repeat(1, 1fr);
    }
    ::before {
      content: "";
      background-image: url(${img});
      height: 100%;
      width: 100%;
      position: fixed;
      top: 10%;
      left: 25%;
      z-index: 0;
      opacity: 0.05;
      background-size: 800px;
      background-repeat: no-repeat;
    }
  `,
}
