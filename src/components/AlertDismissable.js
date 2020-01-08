import React from "react"
import { Modal, Button } from "react-bootstrap"

const AlertDismissable = ({ show, handleDltConf, handleDeleteClick }) => {
  return (
    <Modal show={show} onHide={handleDeleteClick} keyboard={true}>
      <Modal.Body>Do you really want to delete this contact?</Modal.Body>
      <Modal.Footer>
        <Button className="connection-button custom" onClick={handleDltConf}>
          Delete
        </Button>
        <Button className="custom" onClick={handleDeleteClick}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AlertDismissable
