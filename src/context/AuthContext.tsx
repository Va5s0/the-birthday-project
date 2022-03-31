import React, { ReactNode } from "react"
import {
  getAuth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  UserCredential,
} from "firebase/auth"

type AuthContextType = {
  register: ({ email, password }: Sign) => Promise<UserCredential>
  login: ({ email, password }: Sign) => Promise<User>
  logout: () => Promise<void>
  sendPswdResetEmail: (email: string) => Promise<boolean>
  confirmPswdReset: (code: string, password: string) => Promise<boolean>
}

export type Sign = {
  email: string
  password: string
  callback: VoidFunction
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export const ProvideAuth = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth() || {}
  return <AuthContext.Provider value={auth}> {children} </AuthContext.Provider>
}

export const useAuth = () => {
  return React.useContext(AuthContext)
}

function useProvideAuth() {
  const auth = getAuth()

  const register = ({ email, password }: Sign) =>
    createUserWithEmailAndPassword(auth, email, password).then((user) => user)

  const login = ({ email, password }: Sign) =>
    signInWithEmailAndPassword(auth, email, password).then((response) => {
      const { user } = response
      return user
    })

  const logout = () => signOut(auth)

  const sendPswdResetEmail = (email: string) =>
    sendPasswordResetEmail(auth, email).then(() => {
      return true
    })

  const confirmPswdReset = (code: string, password: string) =>
    confirmPasswordReset(auth, code, password).then(() => {
      return true
    })

  return {
    register,
    login,
    logout,
    sendPswdResetEmail,
    confirmPswdReset,
  }
}
