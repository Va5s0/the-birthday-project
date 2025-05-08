import React from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
} from "@mui/material"
import { css, cx } from "@emotion/css"
import { Common, Contact } from "../models/contact"
import GhostTextInput from "./inputs/GhostTextInput"
import { get } from "lodash/fp"
import { CardInfo } from "./Card/CardInfo"
import CloseIcon from "@mui/icons-material/Close"

type Props = {
  contact?: Contact
  open: boolean
  editable: boolean
  onDelete: (id?: string) => Promise<void>
  errors?: Record<string, any>
  handleChange: (
    evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  onContactChange: (contact?: Partial<Contact>) => void
}

const nameFields = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
]

const Connections = (props: Props) => {
  const {
    contact,
    open,
    editable,
    onDelete,
    errors,
    handleChange,
    onContactChange,
    ...rest
  } = props
  const [expanded, setExpanded] = React.useState<string>()

  const onExpand =
    (id?: string) => (_: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? id : undefined)
    }

  const handleClick = (evt: React.MouseEvent<HTMLInputElement>) =>
    evt?.stopPropagation()

  const handleDelete = (
    evt: React.MouseEvent<HTMLButtonElement>,
    id?: string
  ) => {
    evt?.stopPropagation()
    onDelete(id)
  }

  return (
    <div className={styles.connectionsContainer}>
      {!!contact?.connections?.length
        ? contact?.connections?.map((c, cidx) => (
            <Accordion
              key={cidx}
              square
              expanded={expanded === c?.id || false}
              onChange={onExpand(c?.id)}
              classes={{
                root: cx(styles.accordion, { [styles.invisible]: !open }),
              }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                classes={{
                  root: styles.summaryRoot,
                  content: styles.summaryContent,
                }}
              >
                {editable ? (
                  nameFields.map((nf, idx) => (
                    <GhostTextInput
                      key={idx}
                      name={`connections.${cidx}.${nf?.value}`}
                      placeholder={nf?.label}
                      value={(c[nf?.value as keyof Common] as string) || ""}
                      onChange={handleChange}
                      onClick={handleClick}
                      className={styles.ghostConnectionInput}
                      error={
                        !!errors &&
                        !!get(`connections.${cidx}.${nf?.value}`, errors)
                      }
                      errorMessage={
                        !!errors
                          ? get(`connections.${cidx}.${nf?.value}`, errors)
                          : ""
                      }
                    />
                  ))
                ) : (
                  <div className={styles.nameContainer}>
                    {`${c.firstName} ${c?.lastName || ""}`}
                    <IconButton
                      onClick={(e) => handleDelete(e, c?.id)}
                      classes={{ root: styles.iconButton }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                )}
              </AccordionSummary>
              <AccordionDetails classes={{ root: styles.detailsRoot }}>
                <CardInfo
                  contact={contact}
                  editable={editable}
                  errors={errors}
                  index={String(cidx)}
                  onContactChange={onContactChange}
                  {...rest}
                />
              </AccordionDetails>
            </Accordion>
          ))
        : null}
    </div>
  )
}

export default Connections

const styles = {
  connectionsContainer: css`
    position: absolute;
    width: 100%;
  `,
  accordion: css`
    border: none;
    border-radius: 12px !important;
    margin-bottom: 12px !important;
    background: #ffffff;
    box-shadow: 0 4px 6px 4px rgba(0, 0, 0, 0.03),
      0 2px 4px 4px rgba(0, 0, 0, 0.13);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px 4px rgba(0, 0, 0, 0.03),
        0 2px 4px 4px rgba(0, 0, 0, 0.13);
    }

    &.Mui-expanded {
      box-shadow: 0 4px 6px 4px rgba(0, 0, 0, 0.03),
        0 2px 4px 4px rgba(0, 0, 0, 0.13);
    }

    &:last-child {
      margin-bottom: 0 !important;
    }
  `,
  invisible: css`
    opacity: 0;
    display: none;
    box-shadow: none;
  `,
  summaryRoot: css`
    min-height: 48px;
    background: #9333ea;
    color: white;
    padding: 0 16px;
    transition: all 0.3s ease;

    &.Mui-expanded {
      min-height: 48px;
    }

    &.Mui-focused {
      background: #9333ea;
    }

    &:hover {
      background: #a855f7;
    }
  `,
  summaryContent: css`
    margin: 8px 0;
    display: flex;
    align-items: center;
    width: 100%;

    &.Mui-expanded {
      margin: 8px 0;
    }
  `,
  nameContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: white;
    letter-spacing: -0.025em;
  `,
  ghostConnectionInput: css`
    max-width: 160px;
    border-radius: 8px;
    padding: 4px 8px;
    color: white;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.025em;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  `,
  iconButton: css`
    padding: 8px;
    color: white;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }
  `,
  detailsRoot: css`
    padding: 16px;
    background: #ffffff;
  `,
}
