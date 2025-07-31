import React, { useMemo } from "react"
import { DatePicker } from "@mui/x-date-pickers"
import { css } from "@emotion/css"
import { InputAdornment } from "@mui/material"

type Props = {
  name: string
  label?: string
  placeholder?: string
  value: string
  onChange: (date: Date | null, name: string) => void
  icon?: React.ReactNode
  error?: boolean
  errorMessage?: string
  disableFuture?: boolean
  margin?: "dense" | "normal" | "none"
  size?: "small" | "medium"
  className?: string
  fullWidth?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
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
    className,
    fullWidth = false,
    onKeyDown,
  } = props

  const dateValue = useMemo(() => {
    return value ? new Date(value) : null
  }, [value])

  return (
    <DatePicker
      label={label}
      value={dateValue}
      onChange={(date: Date | null) => onChange(date, name)}
      disableFuture={disableFuture}
      format="dd/MM/yyyy"
      className={className}
      slotProps={{
        textField: {
          fullWidth,
          variant: "outlined",
          margin: margin === "none" ? undefined : margin,
          size,
          placeholder,
          error,
          helperText: errorMessage,
          onKeyDown,
          InputProps: {
            startAdornment: icon ? (
              <InputAdornment position="start">{icon}</InputAdornment>
            ) : undefined,
            classes: { input: styles.input, root: styles.field },
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
  input: css`
    padding-left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  field: css`
    background-color: var(--white);
  `,
}
