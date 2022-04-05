import * as React from "react"
import { Sign, useAuth } from "context/AuthContext"
import CircularProgress from "@material-ui/core/CircularProgress"
import EmailIcon from "@material-ui/icons/Email"
import LockIcon from "@material-ui/icons/Lock"
import { Button } from "@material-ui/core"
import { Loading } from "components/Loading"
import { SnackBar } from "components/SnackBar"
import { TextInput } from "components/inputs/TextInput"
import { css } from "@emotion/css"
import { useHistory } from "react-router-dom"
import { ActionContent } from "./Landing"

type Props = {
  action: ActionContent
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
  const [pending, setPending] = React.useState<boolean>(false)
  const history = useHistory()
  const { register, login, error, resetError } = useAuth() ?? {}

  const handleResetError = React.useCallback(
    () => resetError && resetError(undefined),
    [resetError]
  )

  const onChange = React.useCallback(
    (evt) => {
      const {
        target: { name, value },
      } = evt
      handleResetError()
      setValues((s) => ({ ...s, [name]: value }))
    },
    [setValues, handleResetError]
  )

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setPending(true)
    const canIRegister = !!register && action.value === "signUp"
    const canILogin = !!login && action.value === "login"
    if (canIRegister) {
      register(values).then((value) => {
        if (!!value?.user?.uid) {
          history.push("/")
        }
      })
      setPending(false)
    } else if (canILogin) {
      login(values).then((value) => {
        if (!!value?.uid) {
          history.push("/")
        }
      })
      setPending(false)
    }
  }

  const handleResetPassword = () => {}

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {pending ? (
          <Loading />
        ) : (
          <>
            {!process.env.REACT_APP_HIDE_FORM_LOGIN ? (
              <>
                <form
                  className={styles.form}
                  onSubmit={handleSubmit}
                  noValidate
                >
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
                    {action.label}
                  </Button>
                </form>
                {action.value === "login" ? (
                  <Button
                    className={styles.textButton}
                    onClick={handleResetPassword}
                  >
                    Forgot Password?
                  </Button>
                ) : null}
              </>
            ) : null}
          </>
        )}
      </div>
      <SnackBar
        open={!!error}
        onClose={handleResetError}
        message={error!}
        severity="error"
      />
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
  textButton: css`
    padding: 0;
    min-width: fit-content;
    text-transform: capitalize;
    text-decoration: underline;
    font-size: 12px;
    margin-top: 16px;
    :hover {
      background-color: transparent;
      text-decoration: underline;
    }
  `,
}
