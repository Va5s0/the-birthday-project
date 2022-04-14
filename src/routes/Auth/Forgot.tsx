import * as React from "react"
import { useAuth } from "context/AuthContext"
import CircularProgress from "@material-ui/core/CircularProgress"
import EmailIcon from "@material-ui/icons/Email"
import { Button } from "@material-ui/core"
import { Loading } from "components/Loading"
import { SnackBar } from "components/SnackBar"
import { TextInput } from "components/inputs/TextInput"
import { css } from "@emotion/css"
import { useHistory } from "react-router-dom"

const nope = (s: string) => !s.trim()

export function Forgot() {
  const [email, setEmail] = React.useState<string>("")
  const [pending, setPending] = React.useState<boolean>(false)
  const history = useHistory()
  const { error, resetError, sendPswdResetEmail } = useAuth() ?? {}

  const handleResetError = React.useCallback(
    () => resetError && resetError(undefined),
    [resetError]
  )

  const onChange = React.useCallback(
    (evt) => {
      const {
        target: { value },
      } = evt
      handleResetError()
      setEmail(value)
    },
    [handleResetError]
  )

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setPending(true)
    sendPswdResetEmail &&
      sendPswdResetEmail(email).then(() => {
        setPending(false)
        history.push("/reset")
      })
  }

  return (
    <>
      <div className={styles.firstLine}>Forgot your password?</div>
      <div className={styles.container}>
        <div className={styles.card}>
          {pending ? (
            <Loading />
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <TextInput
                fullWidth
                variant="outlined"
                margin="normal"
                size="medium"
                name="email"
                label="Email"
                placeholder="Type your email"
                onChange={onChange}
                value={email}
                required
                icon={<EmailIcon className={styles.loginIcon} />}
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
                disabled={pending || nope(email)}
                startIcon={
                  pending && <CircularProgress size={20} color="inherit" />
                }
                className={styles.submitBtn}
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
      <SnackBar
        open={!!error}
        onClose={handleResetError}
        message={error?.message!}
        severity="error"
      />
    </>
  )
}

const styles = {
  firstLine: css`
    font-size: 32px;
    text-align: center;
    color: var(--primary-main);
  `,
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
