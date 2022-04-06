import { Route, Router, Switch } from "react-router-dom"
import Base from "./routes/Base"
import { history } from "./my-history"
import { Theme } from "providers/Theme"
import { ProvideAuth } from "context/AuthContext"
import { Landing } from "routes/Auth/Landing"
import { Auth } from "routes/Auth"
import { ResetConfirmation } from "routes/Auth/ResetConfirmation"
import { Forgot } from "routes/Auth/Forgot"

export function App() {
  return (
    <Theme>
      <ProvideAuth>
        <Router history={history}>
          <Switch>
            <Route path="/reset">
              <Auth component={ResetConfirmation} />
            </Route>
            <Route path="/forgot">
              <Auth component={Forgot} />
            </Route>
            <Route path="/signup">
              <Auth component={Landing} path="signup" />
            </Route>
            <Route path="/login">
              <Auth component={Landing} path="login" />
            </Route>
            <Route component={Base} />
          </Switch>
        </Router>
      </ProvideAuth>
    </Theme>
  )
}
