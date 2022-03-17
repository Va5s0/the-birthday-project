import { InputAdornment } from "@material-ui/core"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"
import { css } from "emotion"
import { ReactNode } from "react"

type Extra = {
  errorMessage?: string
  icon?: ReactNode
  isPhone?: boolean
}
export type TextInputProps = TextFieldProps & Extra

export function TextInput(props: TextInputProps) {
  const {
    value,
    error,
    errorMessage,
    helperText,
    InputProps,
    className,
    margin = "normal",
    size = "medium",
    icon,
    isPhone = false,
    ...rest
  } = props
  const _error = !!errorMessage || error
  const helper = _error ? errorMessage! : helperText
  return (
    <TextField
      size={size}
      margin={margin}
      variant="outlined"
      value={value}
      error={_error}
      helperText={helper}
      className={className}
      type={isPhone ? "number" : "text"}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" className={styles.adornment}>
            {icon}
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  )
}

const styles = {
  adornment: css`
    > svg {
      width: 24px;
      height: 24px;
      color: grey;
    }
  `,
}
