import React from "react"
import { Contact } from "../models/contact"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"
import DropdownIcon from "@mui/icons-material/KeyboardArrowDown"
import { dateFormatter, easter, getFullYearDate } from "../utils/index"
import { css, cx } from "@emotion/css"
import { DateInput } from "./inputs/DateInput"
import { differenceInDays, addDays } from "date-fns"
import { api } from "../services/api"
import { debounce } from "lodash"

type Props = {
  index?: string
  contact: Partial<Contact>
  onContactChange: (contact?: Partial<Contact>) => void
  hasError?: (value?: string | undefined, index?: string | undefined) => boolean
  errorMsg?: (value?: string | undefined, index?: string | undefined) => string
  margin?: "dense" | "normal"
  size?: "small" | "medium"
  className?: string
}

const specialNamedayCalc = (
  day?: string,
  month?: string,
  toEaster?: number
) => {
  let specialDate
  if (!!day && !!month && !!toEaster) {
    specialDate =
      differenceInDays(getFullYearDate(day, month), easter()) <= 0
        ? addDays(easter(), toEaster).toISOString()
        : getFullYearDate(day, month).toISOString()
  } else if (!!toEaster) {
    specialDate = addDays(easter(), toEaster).toISOString()
  } else specialDate = getFullYearDate(day, month).toISOString()
  return specialDate
}

const Nameday = (props: Props) => {
  const {
    index,
    contact,
    onContactChange,
    hasError,
    errorMsg,
    margin = "dense",
    size = "small",
    className,
  } = props
  const [namedayList, setNamedayList] = React.useState<
    Array<{ day?: string; month?: string; toEaster?: number }>
  >([])

  const handleDateChange = (date: Date | null) => {
    let updated = contact
    if (date instanceof Date && !isNaN(date.getTime())) {
      updated = {
        ...contact,
        namedayId: "",
        namedayDate: date.toISOString(),
      }
    } else {
      updated = contact
    }
    onContactChange(updated)
  }

  const handleSelectChange = (evt: SelectChangeEvent<string>, idx?: string) => {
    const { value } = evt.target
    const updated = {
      ...contact,
      namedayId: idx || "",
      namedayDate: value,
    }
    onContactChange(updated)
  }

  const onSelectChange = (evt: SelectChangeEvent<string>) => {
    const { value } = evt.target
    const idx = namedays?.indexOf(value).toString()
    handleSelectChange(evt, idx)
  }

  const namedays = React.useMemo(() => {
    const dates = namedayList?.map((n) =>
      specialNamedayCalc(n?.day, n?.month, n?.toEaster)
    )
    // Remove duplicates by converting to Set and back to array
    return [...new Set(dates)]
  }, [namedayList])

  const value = !index ? contact : (contact?.connections || [])[Number(index)]

  // Create debounced search function
  const debouncedSearchNamedays = React.useMemo(
    () =>
      debounce((firstName: string) => {
        api
          .searchNamedays(firstName)
          .then((results) => {
            // Flatten the results
            const allNamedays: Array<{
              day?: string
              month?: string
              toEaster?: number
            }> = []
            Object.values(results).forEach((namedays) => {
              if (Array.isArray(namedays)) {
                allNamedays.push(...namedays)
              }
            })
            setNamedayList(allNamedays)
          })
          .catch((error) => {
            console.error("API namedays query error:", error)
            setNamedayList([])
          })
      }, 500),
    []
  )

  React.useEffect(() => {
    const firstName = (value as any)?.["firstName"]
    if (!firstName) {
      setNamedayList([])
      return
    }

    // Call debounced search
    debouncedSearchNamedays(firstName)
  }, [value, debouncedSearchNamedays])

  return !!namedayList?.length ? (
    <FormControl
      variant="outlined"
      margin={margin}
      className={cx(styles.form, className)}
      fullWidth
    >
      <InputLabel id="outlined-label">Nameday</InputLabel>
      <Select
        name={!index ? "nameday" : `connections.${index}.nameday`}
        label={"Nameday"}
        placeholder={"Nameday"}
        value={value?.namedayDate || ""}
        onChange={onSelectChange}
        startAdornment={
          <PermContactCalendarIcon
            className={cx(styles.commonIcon, styles.adornment)}
          />
        }
        IconComponent={() => (
          <DropdownIcon
            className={cx({
              [styles.adornment]: margin === "normal",
            })}
          />
        )}
        error={!!hasError && hasError(value?.namedayDate ?? undefined, index)}
        className={styles.select}
      >
        {namedays?.map((nd, idx) => (
          <MenuItem key={idx} value={nd} classes={{ root: styles.menuItem }}>
            {dateFormatter(nd)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <DateInput
      name={!index ? "nameday" : `connections.${index}.nameday`}
      label={"Nameday"}
      placeholder={"Nameday"}
      value={value?.namedayDate || ""}
      margin={margin}
      size={size}
      onChange={handleDateChange}
      icon={<PermContactCalendarIcon className={styles.commonIcon} />}
      error={hasError && hasError(value?.namedayDate ?? undefined, index)}
      errorMessage={
        !!errorMsg
          ? errorMsg(value?.namedayDate ?? undefined, index)
          : undefined
      }
      className={className}
      fullWidth
    />
  )
}

export default Nameday

const styles = {
  form: css`
    .normalPadding {
      .MuiSelect-outlined.MuiSelect-outlined {
        padding: 16px;
      }
    }
  `,
  select: css`
    height: 48px;
    padding: 0 8px 0 16px;
    color: rgba(0, 0, 0, 0.54);
    background-color: var(--white);
  `,
  menuItem: css`
    font-size: 12px;
  `,
  commonIcon: css`
    color: var(--primary-dark);
  `,
  adornment: css`
    width: 20px;
    height: 20px;
    margin-right: 8px;
  `,
}
