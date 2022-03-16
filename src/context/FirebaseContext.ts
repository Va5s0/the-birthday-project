import { FirebaseApp, FirebaseOptions } from "firebase/app"
import { createContext } from "react"

export const FirebaseContext = createContext<any | null>(null)
