import React, { Component } from "react"
import {
  Button,
  ListGroup,
  ListGroupItem,
  Thumbnail,
  Modal,
  Row,
  Glyphicon,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap"
import AppActions from "../actions/AppActions"
import AddConnection from "./AddConnection"
import UpdateParent from "./UpdateParent"
import ConnectionListItem from "./ConnectionListItem"
import NamedayListGroup from "./NamedayListGroup"
import update from "react-addons-update"
import moment from "moment"

class ParentListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openUpdate: false,
      openParent: false,
      openCon: false,
      contact: this.props.contact,
      year: moment().get("year").toString(),
    }
  }

  closeParent = () => {
    this.setState({ openParent: false })
  }

  closeUpdate = () => {
    this.setState({ openUpdate: false })
  }

  openUpdate = () => {
    this.setState({ openUpdate: true })
  }

  closeCon = () => {
    this.setState({ openCon: false })
  }

  openCon = () => {
    this.setState({ openCon: true })
  }

  handleDeleteClick = (id) => (e) => {
    AppActions.deleteParent(id)
  }

  onChildChanged = (id, connections) => {
    let parent = this.props.parent
    parent.connections = connections
    this.setState({ parent: parent }, function () {
      AppActions.updateParent(id, this.state.parent)
    })
    this.closeCon()
  }

  onParentChanged = (id, parent) => {
    AppActions.updateParent(id, parent)
    this.closeUpdate()
  }

  onNamedayChange = (date, id, parent, index) => {
    let newParent = {
      firstName: this.props.parent.firstName,
      lastName: this.props.parent.lastName,
      phone: this.props.parent.phone,
      email: this.props.parent.email,
      birthday: this.props.parent.birthday,
      nameday: {
        nameday_id: id,
        date: date,
      },
    }
    AppActions.updateParent(
      this.props.parent.id,
      update(this.props.parent, { $merge: newParent })
    )
  }

  render() {
    const { contact } = this.props
    const tooltip = <Tooltip id="modal-tooltip">Add a connection</Tooltip>

    let connectionListItems
    if (!!contact?.connections?.length) {
      connectionListItems = contact?.connections?.map((connection) => {
        return (
          <ConnectionListItem
            key={connection.id}
            connection={connection}
            index={contact.connections.indexOf(connection)}
            parent={contact}
            id={contact.id}
            callbackParent={this.onChildChanged}
          />
        )
      })
    } else {
      connectionListItems = (
        <ConnectionListItem parent={contact} id={contact.id} />
      )
    }

    let namedayItem
    // checks whether the existing year matches the current year
    if (
      moment(contact?.nameday?.date).year().toString() !== this.state.year &&
      contact?.nameday?.date !== null
    ) {
      namedayItem = (
        <NamedayListGroup
          name={contact.firstName}
          callbackNamedayParent={this.onNamedayChange}
          date={contact.nameday.date}
          dateId={contact.nameday.nameday_id}
          child={false}
        />
      )
    } else {
      namedayItem = (
        <ListGroupItem>
          <img
            src="images/calendar.png"
            className="glyph"
            width="35px"
            alt=""
          />{" "}
          {contact?.nameday?.date !== null
            ? moment(contact?.nameday?.date).format("DD/MM/YYYY")
            : contact?.nameday?.date}
        </ListGroupItem>
      )
    }
    const bdayDate = !!contact.birthday
      ? new Date(contact.birthday).toLocaleDateString("en-GB")
      : ""

    return (
      <div>
        <Thumbnail>
          <div className="profile-img-box">
            <img src="images/avatar.png" alt="Avatar" className="profile-img" />
          </div>
          <div className="profile-content-box">
            <div className="profile-content-name">
              <h3
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.setState({ openParent: !this.state.openParent })
                }
              >
                {contact.firstName} {contact.lastName}
              </h3>
            </div>
            <div className="profile-content-buttons">
              <p>
                <Button
                  className="custom"
                  onClick={this.handleDeleteClick(contact.id)}
                >
                  {" "}
                  <Glyphicon glyph="glyphicon glyphicon-remove" />{" "}
                </Button>
                &nbsp;
                <Button className="custom" onClick={this.openUpdate}>
                  {" "}
                  <Glyphicon glyph="glyphicon glyphicon-pencil" />{" "}
                </Button>
              </p>
            </div>
          </div>
          <Modal
            show={this.state.openParent}
            onHide={this.closeParent}
            keyboard={true}
          >
            <Modal.Header>
              <Modal.Title>
                {contact.firstName} {contact.lastName}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="card-modal">
              <div className="parent_card">
                <ListGroup>
                  <ListGroupItem>
                    <img
                      src="images/phone.png"
                      className="glyph"
                      width="35px"
                      alt=""
                    />{" "}
                    {contact.phone}
                  </ListGroupItem>
                  <ListGroupItem>
                    <img
                      src="images/mail-ru.png"
                      className="glyph"
                      width="35px"
                      alt=""
                    />{" "}
                    {contact.email}
                  </ListGroupItem>
                  <ListGroupItem>
                    <img
                      src="images/cake-layered.png"
                      className="glyph"
                      width="35px"
                      alt=""
                    />{" "}
                    {bdayDate}
                  </ListGroupItem>
                  {namedayItem}
                </ListGroup>
              </div>

              <Row>
                <div>{connectionListItems}</div>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <OverlayTrigger placement="left" overlay={tooltip}>
                <Button
                  className="connection-button custom"
                  onClick={this.openCon}
                >
                  <Glyphicon glyph="glyphicon glyphicon-plus" />
                </Button>
              </OverlayTrigger>
              <Button className="custom" onClick={this.closeParent}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Thumbnail>

        <Modal
          show={this.state.openUpdate}
          onHide={this.closeUpdate}
          keyboard={true}
        >
          <Modal.Body className="add-modal">
            <UpdateParent
              id={contact.id}
              parent={contact}
              callbackParent={this.onParentChanged}
            />
          </Modal.Body>
        </Modal>

        <Modal show={this.state.openCon} onHide={this.closeCon} keyboard={true}>
          <Modal.Body className="add-modal">
            <AddConnection
              id={contact.id}
              parent={contact}
              callbackParent={this.onChildChanged}
            />
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default ParentListItem
