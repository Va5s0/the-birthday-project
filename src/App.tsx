import { Router } from "react-router-dom"
import { ProvideAuth } from "./context/AuthContext"
import { FirebaseContext } from "./context/FirebaseContext"
import { firebase } from "./firebase/fbConfig"
import Base from "./routes/Base"
import { history } from "./my-history"
import { Theme } from "providers/Theme"

export function App() {
  return (
    <Theme>
      <FirebaseContext.Provider value={{ firebase }}>
        <ProvideAuth>
          <Router history={history}>
            <Base />
          </Router>
        </ProvideAuth>
      </FirebaseContext.Provider>
    </Theme>
  )
}
