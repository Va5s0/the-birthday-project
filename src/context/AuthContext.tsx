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
  onAuthStateChanged,
  updateProfile,
  deleteUser,
} from "firebase/auth"
import { errorCodes } from "./errorCodes"
import { firebase } from "firebase/fbConfig"

const actionCodeSettings = (email: string) => ({
  url: `http://localhost:3001/reset?email=${email}`,
  handleCodeInApp: true,
})

type AuthContextType = {
  user: User | null
  loading: boolean
  register: ({ email, password }: Sign) => Promise<UserCredential>
  login: ({ email, password }: Sign) => Promise<User>
  logout: () => Promise<void>
  sendPswdResetEmail: (email: string) => Promise<boolean>
  confirmPswdReset: (code: string, password: string) => Promise<boolean>
  editProfile: (
    user: User,
    {
      displayName,
      photoURL,
    }: {
      displayName: string
      photoURL: string
    }
  ) => void
  userDelete: (user: User) => Promise<any>
  error?: string
  resetError: (error?: string) => void
}

export type Sign = {
  email: string
  password: string
  callback: VoidFunction
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export const ProvideAuth = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth() || {}
  return (
    <AuthContext.Provider value={{ ...auth, ...firebase }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)

function useProvideAuth() {
  const auth = getAuth()
  const [user, setUser] = React.useState<User | null>(auth.currentUser)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | undefined>()

  const onComplete = (user: User | null) => {
    setUser(user)
    setLoading(false)
  }

  const register = ({ email, password }: Sign) =>
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => user)
      .catch((e) => {
        const errorCode = e?.code as string
        setError(errorCodes[errorCode as keyof typeof errorCodes])
        return e
      })

  const login = ({ email, password }: Sign) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        const { user } = response
        return user
      })
      .catch((e) => {
        const errorCode = e?.code as string
        setError(errorCodes[errorCode as keyof typeof errorCodes])
        return e
      })

  const logout = () => signOut(auth)

  const sendPswdResetEmail = (email: string) =>
    sendPasswordResetEmail(auth, email, actionCodeSettings(email))
      .then(() => {
        return true
      })
      .catch((e) => {
        const errorCode = e?.code as string
        setError(errorCodes[errorCode as keyof typeof errorCodes])
        return e
      })

  const confirmPswdReset = (code: string, password: string) =>
    confirmPasswordReset(auth, code, password)
      .then(() => {
        return true
      })
      .catch((e) => {
        const errorCode = e?.code as string
        setError(errorCodes[errorCode as keyof typeof errorCodes])
        return e
      })

  const editProfile = (
    user: User,
    { displayName, photoURL }: { displayName: string; photoURL: string }
  ) => {
    updateProfile(user, {
      displayName,
      photoURL,
    }).catch((e) => {
      const errorCode = e?.code as string
      setError(errorCodes[errorCode as keyof typeof errorCodes])
      return e
    })
  }

  const userDelete = (user: User) =>
    deleteUser(user).catch((e) => {
      const errorCode = e?.code as string
      setError(errorCodes[errorCode as keyof typeof errorCodes])
      return e
    })

  const resetError = (error?: string) => setError(error)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onComplete)
    return () => unsubscribe()
  }, [auth, auth.currentUser])

  return {
    user,
    loading,
    register,
    login,
    logout,
    error,
    sendPswdResetEmail,
    confirmPswdReset,
    editProfile,
    userDelete,
    resetError,
  }
}
