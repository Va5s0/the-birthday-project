import React from "react"
import { ref, get } from "firebase/database"
import { rldb } from "../firebase/fbConfig"
import { getAuth } from "firebase/auth"
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
import { set } from "lodash/fp"
import { differenceInDays, addDays } from "date-fns"

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
  const auth = getAuth()
  const { currentUser } = auth
  const [namedayList, setNamedayList] = React.useState<
    Array<{ day?: string; month?: string; toEaster?: number }>
  >([])

  const handleDateChange = (date: Date | null, name: string) => {
    let updated = contact
    if (date instanceof Date && !isNaN(date.getTime())) {
      updated = set(name, { nameday_id: "", date: date.toISOString() }, contact)
    } else {
      updated = contact
    }
    onContactChange(updated)
  }

  const handleSelectChange = (evt: SelectChangeEvent<string>, idx?: string) => {
    const { name, value } = evt.target
    const updated = !!name
      ? set(name, { nameday_id: idx, date: value }, contact)
      : contact
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

  React.useEffect(() => {
    if (!value["firstName"]) {
      setNamedayList([])
      return
    }

    // Query the entire names node
    const namesRef = ref(rldb, "/names")
    get(namesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const allData = snapshot.val()

          // Filter for names that start with our search term
          const searchTerm = (value as any)["firstName"]?.toLowerCase()
          const results = Object.entries(allData)
            .filter(([key]) => {
              const name = key.toLowerCase()
              return name.startsWith(searchTerm)
            })
            .flatMap(([_, value]) => {
              // Ensure we're working with an array
              const namedays = Array.isArray(value) ? value : [value]
              return namedays.map((nd) => ({
                day: nd.day,
                month: nd.month,
                toEaster: nd.toEaster,
              }))
            })

          setNamedayList(results)
        } else {
          setNamedayList([])
        }
      })
      .catch((error) => {
        console.error("Firebase query error:", error)
        setNamedayList([])
      })
  }, [currentUser, value["firstName"]])

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
        value={value?.nameday?.date || ""}
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
        error={!!hasError && hasError(value?.nameday?.date, index)}
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
      value={value?.nameday?.date || ""}
      margin={margin}
      size={size}
      onChange={handleDateChange}
      icon={<PermContactCalendarIcon className={styles.commonIcon} />}
      error={hasError && hasError(value?.nameday?.date, index)}
      errorMessage={
        !!errorMsg ? errorMsg(value?.nameday?.date, index) : undefined
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