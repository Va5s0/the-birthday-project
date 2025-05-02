import React from "react"
import { DatePicker } from "@mui/x-date-pickers"
import { css } from "@emotion/css"

type Props = {
  name: string
  label: string
  placeholder: string
  value: string
  onChange: (date: Date | null, name: string) => void
  icon?: React.ReactNode
  error?: boolean
  errorMessage?: string
  disableFuture?: boolean
  margin?: "dense" | "normal"
  size?: "small" | "medium"
}

export const DateInput = (props: Props) => {
  const {
    name,
    label,
    placeholder,
    value,
    onChange,
    icon,
    error,
    errorMessage,
    disableFuture,
    margin = "dense",
    size = "small",
  } = props

  return (
    <DatePicker
      label={label}
      value={value ? new Date(value) : null}
      onChange={(date: Date | null) => onChange(date, name)}
      disableFuture={disableFuture}
      slotProps={{
        textField: {
          fullWidth: true,
          variant: "outlined",
          margin,
          size,
          placeholder,
          error,
          helperText: errorMessage,
          InputProps: {
            startAdornment: icon,
          },
          InputLabelProps: {
            shrink: true,
          },
        },
      }}
    />
  )
}

const styles = {
  btn: css`
    margin-right: -0.5rem;
  `,
  focusedError: css`
    border: 2px solid red;
  `,
  icon: css`
    margin-right: -0.5rem;
  `,
}
