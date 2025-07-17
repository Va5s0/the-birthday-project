import { Contact, Common } from "../../models/contact"
import CakeIcon from "@mui/icons-material/Cake"
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"
import { dateFormatter } from "../../utils/index"
import { css, cx } from "@emotion/css"
import { contactFields } from "src/utils/contactFields"

type Props = {
  contact: Contact
  editable: boolean
  index?: string
  isConnection?: boolean
}

export const CardInfo = (props: Props) => {
  const { contact, editable, index, isConnection = false } = props

  const value = !index ? contact : (contact?.connections || [])[Number(index)]

  const activeFields = isConnection ? [] : contactFields

  return (
    <div
      className={cx(
        styles.wrapper,
        editable && styles.narrow,
        isConnection && styles.singleColumn
      )}
    >
      {/* First Column - Contact Info */}
      {!isConnection && (
        <div className={styles.commonRow}>
          {activeFields.map((cf, idx) => {
            const Cmp = cf.icon
            const fieldValue = String(value[cf?.value as keyof Common] || "")
            return (
              <div key={idx} className={styles.commonContainer}>
                <Cmp className={styles.commonIcon} />
                <div className={styles.textContent}>
                  {fieldValue || cf?.label}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Second Column - Dates */}
      <div className={styles.commonRow}>
        <div className={styles.commonContainer}>
          <CakeIcon className={styles.commonIcon} />
          <div className={styles.dateContent}>
            {value?.birthday ? dateFormatter(value.birthday) : "Birthday"}
          </div>
        </div>
        <div className={styles.commonContainer}>
          <PermContactCalendarIcon className={styles.commonIcon} />
          <div className={styles.dateContent}>
            {value?.nameday?.date
              ? dateFormatter(value.nameday.date)
              : "Nameday"}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: css`
    display: grid;
    grid-template-columns: 155px 125px;
    grid-column-gap: 16px;
    align-items: start;
    z-index: 10;
    min-width: 0;
    overflow: hidden;

    @media (max-width: 480px) {
      grid-template-columns: 130px 100px;
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
  singleColumn: css`
    grid-template-columns: 1fr;
    grid-column-gap: 0;
  `,
  textContent: css`
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    font-size: 0.75rem;
    line-height: 1.4;

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  `,
  noWrapContent: css`
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.75rem;
    line-height: 1.4;

    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  `,
  dateContent: css`
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    font-size: 0.75rem;
    line-height: 1.4;
    text-align: left;
    overflow: visible;

    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  `,
  dateContentLeft: css`
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    font-size: 0.75rem;
    line-height: 1.4;
    text-align: left;
    overflow: visible;

    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  `,
}
