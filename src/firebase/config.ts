import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAK-JgMLpzYkcayZXVkSiv6MMqMjweQXQY",
  authDomain: "bday-59dee.firebaseapp.com",
  databaseURL: "https://bday-59dee.firebaseio.com",
  projectId: "bday-59dee",
  storageBucket: "bday-59dee.appspot.com",
  messagingSenderId: "97098174516",
  appId: "1:97098174516:web:5ad5377529da8f77747a61",
}

export const firebase = initializeApp(firebaseConfig)

export const db = getFirestore(firebase)
export const rldb = getDatabase(firebase)
