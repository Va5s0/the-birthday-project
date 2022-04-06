import React, { ReactNode } from "react"
import { css } from "emotion"
import { Button } from "@material-ui/core"
import { actions } from "./utils"
import { useHistory, useLocation } from "react-router-dom"

type Props = {
  children: ReactNode
}

export const Landing = (props: Props) => {
  const { children } = props
  const history = useHistory()
  const { pathname } = useLocation()
  const [activeAction, setActiveAction] = React.useState<"login" | "signup">(
    "login"
  )

  const actionToToggle = activeAction === "login" ? "signup" : "login"

  const handleChange = () => {
    setActiveAction(actionToToggle)
    history.push(`/${actions[actionToToggle].value}`)
  }

  const hasFooter = pathname !== "/reset"

  return (
    <>
      <div className={styles.inputsContainer}>{children}</div>
      {hasFooter ? (
        <div className={styles.action}>
          {actions[actionToToggle].message}
          <Button className="btn" onClick={handleChange}>
            {actions[actionToToggle].actionMessage}
          </Button>
        </div>
      ) : null}
    </>
  )
}

const styles = {
  inputsContainer: css`
    width: 256px;
    margin: auto;
    padding: 64px;
    height: 100%;
    min-height: 325px;
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
