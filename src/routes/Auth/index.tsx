import React from "react"
import { css } from "emotion"
import { Button } from "@material-ui/core"
import { actions } from "./utils"
import { useHistory, useLocation } from "react-router-dom"
import img from "assets/celebration.jpg"

type Props = {
  component: (props: any) => JSX.Element
  path?: "login" | "signup"
}

export const Auth = (props: Props) => {
  const { component, path } = props
  const history = useHistory()
  const { pathname } = useLocation()
  const [activeAction, setActiveAction] = React.useState<"login" | "signup">(
    "login"
  )
  const Cmp = component

  const actionToToggle = activeAction === "login" ? "signup" : "login"

  const handleChange = () => {
    setActiveAction(actionToToggle)
    history.push(`/${actions[actionToToggle].value}`)
  }

  const hasFooter = pathname !== "/reset"

  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <div className={styles.inputsContainer}>
          <Cmp path={path} />
        </div>
        {hasFooter ? (
          <div className={styles.action}>
            {actions[actionToToggle].message}
            <Button className="btn" onClick={handleChange}>
              {actions[actionToToggle].actionMessage}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const styles = {
  shell: css`
    display: flex;
    overflow: hidden;
    background: url(${img});
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  `,
  content: css`
    margin: auto;
    background-color: var(--white);
    border-top: 3px solid var(--primary-main);
  `,
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
