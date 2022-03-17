import React from "react"
import { Contact } from "models/contact"
import PhoneIcon from "@material-ui/icons/Phone"
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone"
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail"
import CakeIcon from "@material-ui/icons/Cake"
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar"
import { dateFormatter } from "utils/dateFormatter"
import { css } from "@emotion/css"

type Props = {
  contact: Contact
}

const contactFields = [
  { value: "phone", icon: PhoneIcon },
  { value: "mobile", icon: PhoneIphoneIcon },
  { value: "email", icon: AlternateEmailIcon },
]

export const CardInfo = (props: Props) => {
  const { contact } = props

  return (
    <div className={styles.wrapper}>
      <div className={styles.commonRow}>
        {contactFields.map((cf, idx) => {
          const Cmp = cf.icon
          return !!contact[cf.value as keyof Contact] ? (
            <div className={styles.commonContainer} key={idx}>
              <Cmp className={styles.commonIcon} />
              <div>{contact[cf.value as keyof Contact]}</div>
            </div>
          ) : null
        })}
      </div>
      <div className={styles.commonRow}>
        {!!contact?.birthday ? (
          <div className={styles.commonContainer}>
            <CakeIcon className={styles.commonIcon} />
            <div>{dateFormatter(contact?.birthday)}</div>
          </div>
        ) : null}
        {!!contact?.nameday?.date ? (
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
    color: #f72585;
  `,
}
