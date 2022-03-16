import { Router } from "react-router-dom"
import { ProvideAuth } from "./context/AuthContext"
import { FirebaseContext } from "./context/FirebaseContext"
import { firebase } from "./firebase/config"
import Base from "./routes/Base"
import { history } from "./my-history"

export function App() {
  return (
    <FirebaseContext.Provider value={{ firebase }}>
      <ProvideAuth>
        <Router history={history}>
          <Base />
        </Router>
      </ProvideAuth>
    </FirebaseContext.Provider>
  )
}
