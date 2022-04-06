import { InputAdornment } from "@material-ui/core"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"
import { ReactNode } from "react"

type Extra = {
  errorMessage?: string
  icon?: ReactNode
  isPhone?: boolean
  placeholder?: string
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
    placeholder,
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
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{icon}</InputAdornment>
        ),
      }}
      {...rest}
    />
  )
}
