import React from "react"
import { ref, onValue, query } from "firebase/database"
import { rldb } from "firebase/fbConfig"
import { getAuth } from "firebase/auth"
import { Contact } from "models/contact"
import {
  FormControl,
  InputLabel,
  MenuItem,
  PropTypes,
  Select,
} from "@material-ui/core"
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar"
import DropdownIcon from "@material-ui/icons/KeyboardArrowDown"
import { dateFormatter, easter, getFullYearDate } from "utils/index"
import { css, cx } from "emotion"
import { DateInput } from "./inputs/DateInput"
import { set } from "lodash/fp"
import { differenceInDays, addDays } from "date-fns"

type Props = {
  index?: string
  contact: Contact
  onContactChange: (contact?: Partial<Contact>) => void
  hasError: (value?: string | undefined, index?: string | undefined) => boolean
  errorMsg: (value?: string | undefined, index?: string | undefined) => string
  margin?: PropTypes.Margin
  size?: "small" | "medium"
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
  } = props
  const auth = getAuth()
  const { currentUser } = auth
  const [namedayList, setNamedayList] = React.useState<
    Array<{ day?: string; month?: string; toEaster?: number }>
  >([])

  const handleDateChange = (date: Date | null, name: string) => {
    const updated = set(
      name,
      { nameday_id: "", date: date?.toISOString() },
      contact
    )
    onContactChange(updated)
  }

  const handleSelectChange = (
    evt: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>,
    idx?: string
  ) => {
    const { name, value } = evt.target
    const updated = !!name
      ? set(name, { nameday_id: idx, date: value }, contact)
      : contact
    onContactChange(updated)
  }

  const onSelectChange = (
    evt: React.ChangeEvent<{
      value: unknown
    }>
  ) => {
    const { value } = evt.target
    const idx = namedays?.indexOf(value as string).toString()
    handleSelectChange(evt, idx)
  }

  const namedays = namedayList?.map((n) =>
    specialNamedayCalc(n?.day, n?.month, n?.toEaster)
  )

  const value = !index ? contact : (contact?.connections || [])[Number(index)]

  React.useEffect(() => {
    const fbQuery = query(ref(rldb, `/names/${value["firstName"]}`))
    onValue(
      fbQuery,
      (snapshot) => {
        !!value["firstName"]
          ? setNamedayList(snapshot.val())
          : setNamedayList([])
      },
      (errorObject) => {
        console.log("The read failed: " + errorObject.name)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, value["firstName"]])

  return !!namedayList?.length ? (
    <FormControl variant="outlined" margin={margin}>
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
        error={hasError(value?.nameday?.date, index)}
        className={styles.select}
        // helperText={errorMsg(contact?.nameday?.date, index)}
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
      disableToolbar
      margin={margin}
      size={size}
      onChange={handleDateChange}
      icon={<PermContactCalendarIcon className={styles.commonIcon} />}
      error={hasError(value?.nameday?.date, index)}
      errorMessage={errorMsg(value?.nameday?.date, index)}
    />
  )
}

export default Nameday

const styles = {
  select: css`
    height: 48px;
    padding: 0 8px 0 16px;
    color: rgba(0, 0, 0, 0.54);
  `,
  menuItem: css`
    font-size: 12px;
  `,
  commonIcon: css`
    color: var(--primary-dark);
  `,
  adornment: css`
    width: 24px;
    height: 24px;
    margin-right: 8px;
  `,
}
