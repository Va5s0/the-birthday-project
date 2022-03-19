import React, { ChangeEvent } from "react"
import { Contact } from "models/contact"
import PhoneIcon from "@material-ui/icons/Phone"
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone"
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail"
import CakeIcon from "@material-ui/icons/Cake"
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar"
import { dateFormatter } from "utils/dateFormatter"
import { css } from "@emotion/css"
import { TextInput } from "components/inputs/TextInput"
import { cx } from "emotion"
import { DateInput } from "components/inputs/DateInput"
import { get } from "lodash/fp"

type Props = {
  contact: Contact
  handleChange: (
    evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  handleDateChange: (date: Date | null, name: string) => void
  editable: boolean
  index?: string
  errors?: Record<string, string>
}

const contactFields = [
  { value: "phone", label: "Phone", icon: PhoneIcon },
  { value: "mobile", label: "Mobile", icon: PhoneIphoneIcon },
  { value: "email", label: "Email", icon: AlternateEmailIcon },
]

export const CardInfo = (props: Props) => {
  const { contact, editable, errors, handleChange, handleDateChange, index } =
    props

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
              value={contact[cf?.value as keyof Contact] || ""}
              onChange={handleChange}
              error={hasError(cf?.value, index)}
              errorMessage={errorMsg(cf?.value, index)}
              icon={<Cmp />}
              fullWidth
            />
          ) : !!contact[cf.value as keyof Contact] ? (
            <div className={styles.commonContainer} key={idx}>
              <Cmp className={styles.commonIcon} />
              <div>{contact[cf.value as keyof Contact]}</div>
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
            value={contact?.birthday || ""}
            margin="dense"
            size="small"
            onChange={handleDateChange}
            icon={<CakeIcon />}
            error={hasError(contact?.birthday, index)}
            errorMessage={errorMsg(contact?.birthday, index)}
          />
        ) : !!contact?.birthday ? (
          <div className={styles.commonContainer}>
            <CakeIcon className={styles.commonIcon} />
            <div>{dateFormatter(contact?.birthday)}</div>
          </div>
        ) : null}
        {editable ? (
          <DateInput
            name={!index ? "nameday" : `connections.${index}.nameday`}
            label={"Nameday"}
            placeholder={"Nameday"}
            value={contact?.nameday?.date || ""}
            margin="dense"
            size="small"
            onChange={handleDateChange}
            icon={<PermContactCalendarIcon />}
            error={hasError(contact?.nameday?.date, index)}
            errorMessage={errorMsg(contact?.nameday?.date, index)}
          />
        ) : !!contact?.nameday?.date ? (
          <div className={styles.commonContainer}>
            <PermContactCalendarIcon className={styles.commonIcon} />
            <div>{dateFormatter(contact?.nameday?.date)}</div>
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
    grid-row-gap: 4px;
    width: 100%;
  `,
  commonContainer: css`
    display: flex;
    align-items: center;
    grid-column-gap: 12px;
  `,
  commonIcon: css`
    color: var(--secondary-main);
  `,
  narrow: css`
    grid-column-gap: 16px;
  `,
}
