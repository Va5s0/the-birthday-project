import React from "react"

import {
  DatePickerProps,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers"
import { css, cx } from "@emotion/css"

import DateFnsUtils from "@date-io/date-fns"
import DropdownIcon from "@material-ui/icons/KeyboardArrowDown"
import { startOfDay } from "date-fns"

export type DateInputProps = {
  name: string
  onChange: (date: Date | null, name: string) => void
  value: string | Date | undefined
  dropdownIcon?: boolean
  icon?: React.ReactNode
  errorMessage?: string
} & Omit<DatePickerProps, "name" | "onChange">

export function DateInput(props: DateInputProps) {
  const {
    name,
    value,
    onChange,
    dropdownIcon,
    InputProps,
    error,
    errorMessage,
    fullWidth = true,
    icon,
    margin = "normal",
    size = "medium",
    ...rest
  } = props
  const [open, setOpen] = React.useState<boolean>(false)

  const handleChange = (d: Date | null) => {
    if (d) {
      const _d = startOfDay(d)
      onChange(_d, name)
    } else {
      onChange(null, name)
    }
  }

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        format="dd/MM/yyyy"
        variant="inline"
        inputVariant="outlined"
        fullWidth={fullWidth}
        error={error}
        {...rest}
        name={name}
        value={value || null}
        margin={margin}
        size={size}
        onChange={handleChange}
        onOpen={handleOpen}
        onClose={handleOpen}
        helperText={errorMessage}
        rightArrowButtonProps={{ classes: { root: styles.arrow } }}
        leftArrowButtonProps={{ classes: { root: styles.arrow } }}
        keyboardIcon={<DropdownIcon />}
        InputAdornmentProps={{
          className: styles.icon,
        }}
        InputProps={{
          classes: {
            notchedOutline: cx({ [styles.focusedError]: open && !!error }),
            adornedStart: styles.startAdornment,
          },
          startAdornment: icon,
        }}
      />
    </MuiPickersUtilsProvider>
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
    .MuiIconButton-root {
      padding: 0;
    }
  `,
  startAdornment: css`
    padding: 0 16px;
    > svg {
      width: 24px;
      height: 24px;
      color: var(--secondary-main);
      margin-right: 8px;
    }
  `,
  arrow: css`
    .MuiIconButton-label {
      > svg {
        width: 24px;
        height: 24px;
        color: var(--secondary-main);
      }
    }
  `,
}
