import { Route, Router, Switch } from "react-router-dom"
import { FirebaseContext } from "./context/FirebaseContext"
import { firebase } from "./firebase/fbConfig"
import Base from "./routes/Base"
import { history } from "./my-history"
import { Theme } from "providers/Theme"
import Auth from "routes/Auth"
import { ProvideAuth } from "context/AuthContext"

export function App() {
  return (
    <Theme>
      <FirebaseContext.Provider value={{ firebase }}>
        <ProvideAuth>
          <Router history={history}>
            <Switch>
              <Route path="/login" component={Auth} />
              <Route component={Base} />
            </Switch>
          </Router>
        </ProvideAuth>
      </FirebaseContext.Provider>
    </Theme>
  )
}
