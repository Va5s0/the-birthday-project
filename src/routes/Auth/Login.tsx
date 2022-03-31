import * as React from "react"

import { Sign, useAuth } from "context/AuthContext"

import { AlertDlg } from "components/AlertDlg"
//
import CircularProgress from "@material-ui/core/CircularProgress"
import CloseIcon from "@material-ui/icons/Close"
import Collapse from "@material-ui/core/Collapse"
import IconButton from "@material-ui/core/IconButton"
import EmailIcon from "@material-ui/icons/Email"
import LockIcon from "@material-ui/icons/Lock"
import { Button } from "@material-ui/core"
import { Loading } from "components/Loading"
import { TextInput } from "components/inputs/TextInput"
import { css } from "@emotion/css"
import { useHistory } from "react-router-dom"

type Props = {
  action: "login" | "register"
}

const initialValues: Sign = {
  email: "",
  password: "",
  callback: () => {},
}

const nope = (s: string) => !s.trim()

export function Login(props: Props) {
  const { action } = props
  const [values, setValues] = React.useState<Sign>(initialValues)
  const [error, setError] = React.useState<string | undefined>()
  const [pending, setPending] = React.useState<boolean>(false)
  const history = useHistory()
  const { register, login } = useAuth() ?? {}

  const onChange = React.useCallback(
    (evt) => {
      const {
        target: { name, value },
      } = evt
      setError(undefined)
      setValues((s) => ({ ...s, [name]: value }))
    },
    [setValues]
  )

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setPending(true)
    const canIRegister = !!register && action === "register"
    const canILogin = !!login && action === "login"
    if (canIRegister) {
      register(values)
        .then(() => history.push("/"))
        .catch((error) => {
          setError(error)
        })
      setPending(false)
    } else if (canILogin) {
      login(values)
        .then(() => history.push("/"))
        .catch((error) => {
          setError(error)
        })
      setPending(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {pending ? (
          <Loading />
        ) : (
          <>
            <Collapse in={!!error}>
              <div className={styles.errorWrap}>
                <AlertDlg
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="medium"
                      onClick={() => setError(undefined)}
                      classes={{ root: styles.alertIcon }}
                    >
                      <CloseIcon />
                    </IconButton>
                  }
                >
                  {error!}
                </AlertDlg>
              </div>
            </Collapse>
            {!process.env.REACT_APP_HIDE_FORM_LOGIN ? (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <TextInput
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  size="medium"
                  name="email"
                  label={"Email"}
                  onChange={onChange}
                  value={values.email}
                  required
                  icon={<EmailIcon className={styles.loginIcon} />}
                  InputProps={{
                    classes: { input: styles.input },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextInput
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  size="medium"
                  type="password"
                  name="password"
                  label={"Password"}
                  onChange={onChange}
                  value={values.password}
                  required
                  icon={<LockIcon className={styles.loginIcon} />}
                  InputProps={{
                    classes: { input: styles.input },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                  disabled={
                    pending || nope(values.email) || nope(values.password)
                  }
                  startIcon={
                    pending && <CircularProgress size={20} color="inherit" />
                  }
                  className={styles.submitBtn}
                >
                  {action}
                </Button>
              </form>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  card: css`
    max-width: 256px;
    width: 256px;
  `,
  header: css`
    font-size: 18px;
    padding: 16px 0;
    text-transform: capitalize;
  `,
  form: css`
    display: flex;
    flex-direction: column;
    padding-top: 32px;
  `,
  submitBtn: css`
    margin-top: 16px;
    text-transform: capitalize;
  `,
  errorWrap: css`
    padding-top: 32px;
  `,
  alertIcon: css`
    padding: 0;
    font-size: 1.625rem;
  `,
  loginIcon: css`
    color: var(--dark-grey);
    width: 28px;
    height: 24px;
  `,
  input: css`
    padding-left: 0;
  `,
}
