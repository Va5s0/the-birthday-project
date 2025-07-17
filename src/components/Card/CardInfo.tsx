import React from "react"
import { Contact, Common } from "../../models/contact"
import CakeIcon from "@mui/icons-material/Cake"
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"
import { dateFormatter } from "../../utils/index"
import { css, cx } from "@emotion/css"
import { TextInput } from "../../components/inputs/TextInput"
import { DateInput } from "../../components/inputs/DateInput"
import { get, set } from "lodash/fp"
import Nameday from "../../components/Nameday"
import { contactFields } from "src/utils/contactFields"

type Props = {
  contact: Contact
  editable: boolean
  index?: string
  errors?: Record<string, string>
  onContactChange: (contact?: Partial<Contact>) => void
  isConnection?: boolean
}

export const CardInfo = (props: Props) => {
  const {
    contact,
    editable,
    errors,
    index,
    onContactChange,
    isConnection = false,
  } = props

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

  const activeFields = isConnection ? [] : contactFields

  return (
    <div className={cx(styles.wrapper, editable && styles.narrow)}>
      {/* First Column - Contact Info */}
      <div className={styles.commonRow}>
        {activeFields.map((cf, idx) => {
          const Cmp = cf.icon
          return editable ? (
            <TextInput
              key={idx}
              name={!index ? cf?.value : `connections.${index}.${cf.value}`}
              label={cf?.label}
              margin="dense"
              size="small"
              placeholder={cf?.label}
              value={value[cf?.value as keyof Common]}
              onChange={handleChange}
              error={hasError(cf?.value, index)}
              errorMessage={errorMsg(cf?.value, index)}
              icon={<Cmp className={styles.commonIcon} />}
              fullWidth
            />
          ) : (
            <div className={styles.commonContainer} key={idx}>
              <Cmp className={styles.commonIcon} />
              <div
                className={
                  cf.value === "phone" || cf.value === "email"
                    ? styles.noWrapContent
                    : styles.textContent
                }
              >
                {value[cf.value as keyof Common]
                  ? String(value[cf.value as keyof Common])
                  : ""}
              </div>
            </div>
          )
        })}
      </div>

      {/* Second Column - Dates */}
      <div className={styles.commonRow}>
        {editable ? (
          <>
            <DateInput
              name={!index ? "birthday" : `connections.${index}.birthday`}
              label="Birthday"
              placeholder="Birthday"
              value={value?.birthday || ""}
              disableFuture
              margin="dense"
              size="small"
              onChange={handleDateChange}
              icon={<CakeIcon className={styles.commonIcon} />}
              error={hasError(value?.birthday, index)}
              errorMessage={errorMsg(value?.birthday, index)}
            />
            <Nameday
              index={index}
              contact={contact}
              hasError={hasError}
              errorMsg={errorMsg}
              onContactChange={onContactChange}
            />
          </>
        ) : (
          <>
            <div className={styles.commonContainer}>
              <CakeIcon className={styles.commonIcon} />
              <div className={styles.dateContent}>
                {value?.birthday ? dateFormatter(value?.birthday) : ""}
              </div>
            </div>
            <div className={styles.commonContainer}>
              <PermContactCalendarIcon className={styles.commonIcon} />
              <div className={styles.dateContent}>
                {value?.nameday?.date
                  ? dateFormatter(value?.nameday?.date)
                  : ""}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: css`
    display: grid;
    grid-template-columns: 180px 100px;
    grid-column-gap: 16px;
    align-items: start;
    z-index: 10;
    min-width: 0;
    overflow: hidden;

    @media (max-width: 480px) {
      grid-template-columns: 140px 90px;
    }
  `,
  commonRow: css`
    display: flex;
    flex-direction: column;
    grid-row-gap: 8px;
    width: 100%;
    min-width: 0;
    overflow: hidden;
  `,
  commonContainer: css`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    overflow: hidden;
    > svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      margin: 0;
    }
  `,
  alignRight: css`
    justify-content: flex-end;
  `,
  commonIcon: css`
    color: var(--primary-dark);

    /* Fix alignment for specific icons */
    &.MuiSvgIcon-root {
      margin-left: 0;
      margin-right: 0;
    }
  `,
  narrow: css`
    grid-column-gap: 16px;
  `,
  textContent: css`
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    font-size: 0.875rem;
    line-height: 1.4;

    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  `,
  noWrapContent: css`
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8rem;
    line-height: 1.4;

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  `,
  dateContent: css`
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    font-size: 0.8rem;
    line-height: 1.4;
    text-align: right;
    overflow: visible;

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  `,
}
