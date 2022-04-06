import { Route, Switch } from "react-router-dom"
import { Forgot } from "./Forgot"
import { Landing } from "./Landing"
import { Layout } from "./Layout"
import { Login } from "./Login"
import { ResetConfirmation } from "./ResetConfirmation"
import { actions } from "./utils"

export default function Auth() {
  return (
    <Layout>
      <Landing>
        <Switch>
          <Route path="/reset">
            <ResetConfirmation />
          </Route>
          <Route path="/forgot" component={Forgot} />
          <Route path="/signup">
            <Login action={actions["signup"]} />
          </Route>
          <Route path="/login">
            <Login action={actions["login"]} />
          </Route>
        </Switch>
      </Landing>
    </Layout>
  )
}
