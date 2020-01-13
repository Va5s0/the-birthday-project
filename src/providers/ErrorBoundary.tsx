import React, { useState, useEffect, ReactChildren } from "react"
import { Button } from "react-bootstrap"
import AlertDismissable from "components/AlertDismissable"

type Alert = {
  // message: string
  level?: "INFO" | "WARNING" | "ERROR"
}

type ErrorContextType = {
  setAlert: React.Dispatch<Alert>
}

type Props = {
  children: ReactChildren
}

export const ErrorContext = React.createContext<ErrorContextType>({
  setAlert: () => {},
})

export const useErrorContext = () => {
  const e = React.useContext(ErrorContext)
  return e
}

const ErrorBoundary = ({ children }: Props) => {
  const [alert, setAlert] = useState()
  const contentKey = alert?.message

  useEffect(() => {
    let timer: number
    if (alert) {
      timer = window.setTimeout(() => setAlert(undefined), 3000)
    }
    return () => {
      !!timer && window.clearTimeout(timer)
    }
  }, [alert, setAlert])

  const handleClose = () => {
    console.log("llll", alert, !!contentKey)
    setAlert(undefined)
  }

  const contextValue = React.useMemo(() => {
    return {
      setAlert,
    }
  }, [setAlert])

  return (
    <ErrorContext.Provider value={contextValue}>
      <AlertDismissable
        open={!!contentKey}
        handleClose={handleClose}
        modalContent="Something is wrong!"
      >
        <Button className="connection-button custom" onClick={handleClose}>
          ok
        </Button>
      </AlertDismissable>
      {children}
    </ErrorContext.Provider>
  )
}

export default ErrorBoundary
