import React from "react"
import { InputAdornment } from "@mui/material"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import { css } from "@emotion/css"

type Extra = {
  errorMessage?: string
  icon?: React.ReactNode
  isPhone?: boolean
  placeholder?: string
}
export type TextInputProps = TextFieldProps & Extra

export const TextInput = (props: TextInputProps) => {
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
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : undefined,
        classes: { input: styles.input },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      {...rest}
    />
  )
}

const styles = {
  input: css`
    padding-left: 0;
  `,
}
