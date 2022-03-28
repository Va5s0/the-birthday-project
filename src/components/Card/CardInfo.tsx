import React from "react"
import { Contact, Common } from "models/contact"
import PhoneIcon from "@material-ui/icons/Phone"
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone"
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail"
import CakeIcon from "@material-ui/icons/Cake"
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar"
import { dateFormatter } from "utils/index"
import { css } from "@emotion/css"
import { TextInput } from "components/inputs/TextInput"
import { cx } from "emotion"
import { DateInput } from "components/inputs/DateInput"
import { get, set } from "lodash/fp"
import Nameday from "components/Nameday"

type Props = {
  contact: Contact
  editable: boolean
  index?: string
  errors?: Record<string, string>
  onContactChange: (contact?: Contact) => void
}

const contactFields = [
  { value: "phone", label: "Phone", icon: PhoneIcon },
  { value: "mobile", label: "Mobile", icon: PhoneIphoneIcon },
  { value: "email", label: "Email", icon: AlternateEmailIcon },
]

export const CardInfo = (props: Props) => {
  const { contact, editable, errors, index, onContactChange } = props

  const handleChange = (
    evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    const updated = set(name, value, contact)
    onContactChange(updated)
  }

  const handleDateChange = (date: Date | null, name: string) => {
    const updated = set(name, date?.toISOString(), contact)
    onContactChange(updated)
  }

  const hasError = (value?: string, index?: string) =>
    !!errors &&
    (!index
      ? !!errors[value || ""]
      : !!get(`connections.${index}.${value}`, errors))

  const errorMsg = (value?: string, index?: string) =>
    !!errors
      ? !index
        ? errors[value || ""]
        : get(`connections.${index}.${value}`, errors)
      : ""

  const value = !index ? contact : (contact?.connections || [])[Number(index)]

  return (
    <div className={cx(styles.wrapper, { [styles.narrow]: editable })}>
      <div className={styles.commonRow}>
        {contactFields.map((cf, idx) => {
          const Cmp = cf.icon
          return editable ? (
            <TextInput
              key={idx}
              name={!index ? cf?.value : `connections.${index}.${cf.value}`}
              label={cf?.label}
              margin="dense"
              size="small"
              placeholder={cf?.label}
              value={value[cf?.value as keyof Common] || ""}
              onChange={handleChange}
              error={hasError(cf?.value, index)}
              errorMessage={errorMsg(cf?.value, index)}
              icon={<Cmp className={styles.commonIcon} />}
              fullWidth
            />
          ) : !!value[cf.value as keyof Common] ? (
            <div className={styles.commonContainer} key={idx}>
              <Cmp className={styles.commonIcon} />
              <div>{value[cf.value as keyof Common]}</div>
            </div>
          ) : null
        })}
      </div>
      <div className={styles.commonRow}>
        {editable ? (
          <DateInput
            name={!index ? "birthday" : `connections.${index}.birthday`}
            label={"Birthday"}
            placeholder={"Birthday"}
            value={value?.birthday || ""}
            margin="dense"
            size="small"
            onChange={handleDateChange}
            icon={<CakeIcon />}
            error={hasError(value?.birthday, index)}
            errorMessage={errorMsg(value?.birthday, index)}
          />
        ) : !!value?.birthday ? (
          <div className={styles.commonContainer}>
            <CakeIcon className={styles.commonIcon} />
            <div>{dateFormatter(value?.birthday)}</div>
          </div>
        ) : null}
        {editable ? (
          <Nameday
            index={index}
            contact={contact}
            hasError={hasError}
            errorMsg={errorMsg}
            onContactChange={onContactChange}
          />
        ) : !!value?.nameday?.date ? (
          <div className={styles.commonContainer}>
            <PermContactCalendarIcon className={styles.commonIcon} />
            <div>{dateFormatter(value?.nameday?.date)}</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const styles = {
  wrapper: css`
    display: flex;
    align-items: center;
    grid-column-gap: 30px;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  `,
  commonRow: css`
    display: flex;
    flex-direction: column;
    grid-row-gap: 8px;
    width: 100%;
  `,
  commonContainer: css`
    display: flex;
    align-items: center;
    grid-column-gap: 12px;
    > svg {
      width: 16px;
      height: 16px;
    }
  `,
  commonIcon: css`
    color: var(--secondary-main);
  `,
  narrow: css`
    grid-column-gap: 16px;
  `,
}
