import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"
import { firebaseConfig } from "secrets"

export const firebase = initializeApp(firebaseConfig)

export const db = getFirestore(firebase)
export const rldb = getDatabase(firebase)
