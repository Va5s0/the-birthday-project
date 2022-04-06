import { Route, Router, Switch } from "react-router-dom"
import { FirebaseContext } from "./context/FirebaseContext"
import { firebase } from "./firebase/fbConfig"
import Base from "./routes/Base"
import { history } from "./my-history"
import { Theme } from "providers/Theme"
import { ProvideAuth } from "context/AuthContext"
import { Login } from "routes/Auth/Login"
import { actions } from "routes/Auth/utils"
import { Landing } from "routes/Auth/Landing"
import { ResetConfirmation } from "routes/Auth/ResetConfirmation"
import { Forgot } from "routes/Auth/Forgot"

export function App() {
  return (
    <Theme>
      <FirebaseContext.Provider value={{ firebase }}>
        <ProvideAuth>
          <Router history={history}>
            <Switch>
              <Route path="/reset">
                <Landing>
                  <ResetConfirmation />
                </Landing>
              </Route>
              <Route path="/forgot">
                <Landing>
                  <Forgot />
                </Landing>
              </Route>
              <Route path="/signup">
                <Landing>
                  <Login action={actions["signup"]} />
                </Landing>
              </Route>
              <Route path="/login">
                <Landing>
                  <Login action={actions["login"]} />
                </Landing>
              </Route>
              <Route component={Base} />
            </Switch>
          </Router>
        </ProvideAuth>
      </FirebaseContext.Provider>
    </Theme>
  )
}
