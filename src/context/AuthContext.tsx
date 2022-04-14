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
import { StorageReference, uploadBytes, getBlob } from "firebase/storage"

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
  ) => Promise<void>
  userDelete: (user: User) => Promise<any>
  error?: Error
  resetError: (error?: string) => void
  upload: (
    storageRef: StorageReference,
    file: Blob | Uint8Array | ArrayBuffer
  ) => Promise<void>
  fetchFile: (id: string, ref: StorageReference) => Promise<any>
  snackbar?: boolean
}

export type Sign = {
  email: string
  password: string
  callback: VoidFunction
}

export type Error = {
  code: string | number
  message: string
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
  const [user, setUser] = React.useState<any>(auth.currentUser)
  const [timestamp, setTimestamp] = React.useState<number>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<Error>()
  const [snackbar, setSnackbar] = React.useState<boolean>()

  const onComplete = (user: User | null) => {
    setUser(user)
    setLoading(false)
  }

  const register = ({ email, password }: Sign) =>
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => user)
      .catch((e) => {
        const errorCode = e?.code as string
        setError({
          code: errorCode,
          message: errorCodes[errorCode as keyof typeof errorCodes],
        })
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
        setError({
          code: errorCode,
          message: errorCodes[errorCode as keyof typeof errorCodes],
        })
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
        setError({
          code: errorCode,
          message: errorCodes[errorCode as keyof typeof errorCodes],
        })
        return e
      })

  const confirmPswdReset = (code: string, password: string) =>
    confirmPasswordReset(auth, code, password)
      .then(() => {
        return true
      })
      .catch((e) => {
        const errorCode = e?.code as string
        setError({
          code: errorCode,
          message: errorCodes[errorCode as keyof typeof errorCodes],
        })
        return e
      })

  const editProfile = async (
    user: User,
    { displayName, photoURL }: { displayName: string; photoURL: string }
  ) => {
    await updateProfile(user, {
      displayName,
      photoURL,
    }).catch((e) => {
      const errorCode = e?.code as string
      setError({
        code: errorCode,
        message: errorCodes[errorCode as keyof typeof errorCodes],
      })
      return e
    })
    setTimestamp(Date.now())
  }

  const userDelete = (user: User) =>
    deleteUser(user).catch((e) => {
      const errorCode = e?.code as string
      setError({
        code: errorCode,
        message: errorCodes[errorCode as keyof typeof errorCodes],
      })
      return e
    })

  const resetError = () => setError(undefined)

  const upload = async (
    storageRef: StorageReference,
    file: Blob | Uint8Array | ArrayBuffer
  ) => {
    await uploadBytes(storageRef, file)
      .then(() => {
        console.log("Uploaded a blob or file!")
      })
      .catch((e) => {
        const errorCode = e?.code as string
        setError({
          code: errorCode,
          message: errorCodes[errorCode as keyof typeof errorCodes],
        })
        return e
      })
    setTimestamp(Date.now())
  }

  const fetchFile = (id: string, ref: StorageReference) =>
    getBlob(ref)
      .then((blob) => {
        const image = document.getElementById(id) as HTMLImageElement
        const objectUrl = URL.createObjectURL(blob)
        image.src = objectUrl
      })
      .catch((e) => {
        const errorCode = e?.code as string
        setSnackbar(false)
        setError({
          code: errorCode,
          message: errorCodes[errorCode as keyof typeof errorCodes],
        })
        return e
      })

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onComplete)
    return () => unsubscribe()
  }, [auth, auth.currentUser])

  React.useEffect(
    () => setUser(auth.currentUser),
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [timestamp]
  )

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
    upload,
    fetchFile,
    snackbar,
  }
}
