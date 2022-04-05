import React from "react"
import { css } from "emotion"
import { Login } from "./Login"
import { Button } from "@material-ui/core"

type Action = Record<string, ActionContent>
export type ActionContent = {
  label: string
  value: string
  message: string
  actionMessage: string
}

const actions = {
  login: {
    label: "Login",
    value: "login",
    message: "Already have an account?",
    actionMessage: "Login",
  },
  signUp: {
    label: "Sign Up",
    value: "signUp",
    message: "Don't have an account?",
    actionMessage: "Sign Up",
  },
} as Action

export const Landing = () => {
  const [activeAction, setActiveAction] = React.useState<"login" | "signUp">(
    "login"
  )

  const actionToToggle = activeAction === "login" ? "signUp" : "login"

  const handleChange = () => {
    setActiveAction(actionToToggle)
  }

  return (
    <>
      <div className={styles.inputsContainer}>
        <div className="first">Hello!</div>
        <div className="second">Let's remember to celebrate!</div>
        <Login action={actions[activeAction]} />
      </div>
      <div className={styles.action}>
        {actions[actionToToggle].message}
        <Button className="btn" onClick={handleChange}>
          {actions[actionToToggle].actionMessage}
        </Button>
      </div>
    </>
  )
}

const styles = {
  wrapper: css``,
  inputsContainer: css`
    position: relative;
    width: 256px;
    margin: auto;
    padding: 64px;
    min-height: 325px;
    .first {
      font-size: 32px;
    }
    .second {
      font-size: 16px;
      color: var(--dark-grey);
    }
  `,
  action: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 0;
    border-top: 1px solid var(--light-grey);
    color: var(--light-grey-2);
    .btn {
      color: var(--primary-main);
      padding: 2px 0 0 4px;
      text-transform: capitalize;
      min-width: fit-content;
      :hover {
        background-color: transparent;
        color: var(--primary-dark);
      }
    }
  `,
}
