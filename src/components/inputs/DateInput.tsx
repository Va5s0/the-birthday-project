import React from "react"

import {
  DatePicker,
  DatePickerProps,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers"
import { css, cx } from "@emotion/css"

import DateFnsUtils from "@date-io/date-fns"
import DropdownIcon from "@material-ui/icons/KeyboardArrowDown"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
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
      <DatePicker
        format="P"
        variant="inline"
        inputVariant="outlined"
        fullWidth={fullWidth}
        disableToolbar={true}
        allowKeyboardControl={true}
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
        InputProps={{
          classes: {
            notchedOutline: cx({ [styles.focusedError]: open && !!error }),
            adornedStart: styles.startAdornment,
          },
          startAdornment: icon,
          endAdornment: dropdownIcon ? (
            <InputAdornment position="end">
              <IconButton size="small" classes={{ root: styles.btn }}>
                <DropdownIcon />
              </IconButton>
            </InputAdornment>
          ) : undefined,
          ...InputProps,
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
