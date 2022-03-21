// import { FirebaseApp } from "firebase/app"
import React, { ReactNode } from "react"
import { FirebaseContext } from "./FirebaseContext"

type AuthContextType = {
  // isLoading: boolean
  user: any
  signin: ({ email, password, callback }: Sign) => void
  signup: ({ email, password, callback }: Sign) => void
  signout: () => void
  sendPasswordResetEmail: (email: string) => void
  confirmPasswordReset: (code: string, password: string) => void
}

type Sign = {
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
  // const [isLoading, setIsLoading] = React.useState(true)
  const [user, setUser] = React.useState(null)
  const { firebase } = React.useContext(FirebaseContext) ?? {}

  const signin = ({ email, password, callback }: Sign) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response: any) => {
        setUser(response.user)
        callback()
        return response.user
      })
  }

  const signup = ({ email, password, callback }: Sign) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response: any) => {
        setUser(response.user)
        callback()
        return response.user
      })
  }

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null)
      })
  }

  const sendPasswordResetEmail = (email: string) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true
      })
  }

  const confirmPasswordReset = (code: string, password: string) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true
      })
  }

  // React.useEffect(() => {
  //   const unsubscribe = firebase.auth().onAuthStateChanged((user: User) => {
  //     if (user) {
  //       setUser(user)
  //     } else {
  //       setUser(null)
  //     }
  //     setIsLoading(false)
  //   })
  //   return () => unsubscribe()
  // }, [firebase])

  return {
    // isLoading,
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  }
}
