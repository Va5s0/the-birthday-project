import React from "react"
import { css } from "@emotion/css"
import { Button } from "@mui/material"
import { actions } from "./utils"
import { useNavigate, useLocation } from "react-router-dom"

type Props = {
  component: (props: any) => JSX.Element
  path?: "login" | "signup"
}

export const Auth = (props: Props) => {
  const { component, path } = props
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [activeAction, setActiveAction] = React.useState<"login" | "signup">(
    "login"
  )
  const Cmp = component

  const actionToToggle = activeAction === "login" ? "signup" : "login"

  const handleChange = () => {
    setActiveAction(actionToToggle)
    navigate(`/${actions[actionToToggle].value}`)
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
    width: 350px;
    margin: auto;
    padding: 56px 18px;
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
