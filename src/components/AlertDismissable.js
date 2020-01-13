import React from "react"
import { Modal } from "react-bootstrap"

const AlertDismissable = ({ open, handleClose, modalContent, children }) => {
  return (
    <Modal show={open} onHide={handleClose} keyboard={true}>
      <Modal.Body>{modalContent}</Modal.Body>
      <Modal.Footer>{children}</Modal.Footer>
    </Modal>
  )
}

export default AlertDismissable
