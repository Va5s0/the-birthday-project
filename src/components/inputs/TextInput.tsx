import React, { useMemo } from "react"
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
  
  const inputProps = useMemo(() => ({
    ...InputProps,
    startAdornment: icon ? (
      <InputAdornment position="start">{icon}</InputAdornment>
    ) : undefined,
    classes: { input: styles.input, root: styles.field },
  }), [icon, InputProps])
  
  return (
    <TextField
      size={size}
      margin={margin}
      variant="outlined"
      value={value}
      error={_error}
      helperText={helper}
      className={className}
      type={isPhone ? "tel" : "text"}
      placeholder={placeholder}
      inputMode={isPhone ? "tel" : undefined}
      InputProps={inputProps}
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
  field: css`
    background-color: var(--white);
  `,
}
