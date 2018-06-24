import React, { Component } from "react"
import {
  Button,
  ListGroup,
  ListGroupItem,
  Col,
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
      parent: this.props.parent,
      year: moment()
        .get("year")
        .toString(),
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

  handleDeleteClick = id => e => {
    AppActions.deleteParent(id)
  }

  onChildChanged = (id, connections) => {
    let parent = this.props.parent
    parent.connections = connections
    this.setState({ parent: parent }, function() {
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
      this.props.parent._id.$oid,
      update(this.props.parent, { $merge: newParent })
    )
  }

  render() {
    const { parent } = this.props
    const tooltip = <Tooltip id="modal-tooltip">Add a connection</Tooltip>

    let connectionListItems
    if (parent.connections.length !== 0) {
      connectionListItems = parent.connections.map(connection => {
        return (
          <ConnectionListItem
            key={connection.id}
            connection={connection}
            index={parent.connections.indexOf(connection)}
            parent={parent}
            id={parent._id.$oid}
            callbackParent={this.onChildChanged}
          />
        )
      })
    } else {
      connectionListItems = (
        <ConnectionListItem parent={parent} id={parent._id.$oid} />
      )
    }

    let namedayItem
    // checks whether the existing year matches the current year
    if (
      moment(parent.nameday.date)
        .year()
        .toString() !== this.state.year &&
      parent.nameday.date !== null
    ) {
      namedayItem = (
        <NamedayListGroup
          name={parent.firstName}
          callbackNamedayParent={this.onNamedayChange}
          date={parent.nameday.date}
          dateId={parent.nameday.nameday_id}
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
          {parent.nameday.date !== null
            ? moment(parent.nameday.date).format("DD/MM/YYYY")
            : parent.nameday.date}
        </ListGroupItem>
      )
    }

    return (
      <div>
        <Col xs={6} md={3}>
          <Thumbnail>
            <div className="profile-img-box">
              <img
                className="profile-img"
                src="images/profile-icon-png-d68b89.png"
                alt="10x10"
              />
            </div>
            <div className="profile-content-box">
              <div className="profile-content-name">
                <h3
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    this.setState({ openParent: !this.state.openParent })
                  }
                >
                  {parent.firstName} {parent.lastName}
                </h3>
              </div>
              <div className="profile-content-buttons">
                <p>
                  <Button
                    className="custom"
                    onClick={this.handleDeleteClick(parent._id.$oid)}
                  >
                    {" "}
                    <Glyphicon glyph="glyphicon glyphicon-remove" />{" "}
                  </Button>&nbsp;
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
                  {parent.firstName} {parent.lastName}
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
                      {parent.phone}
                    </ListGroupItem>
                    <ListGroupItem>
                      <img
                        src="images/mail-ru.png"
                        className="glyph"
                        width="35px"
                        alt=""
                      />{" "}
                      {parent.email}
                    </ListGroupItem>
                    <ListGroupItem>
                      <img
                        src="images/cake-layered.png"
                        className="glyph"
                        width="35px"
                        alt=""
                      />{" "}
                      {parent.birthday}
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
        </Col>

        <Modal
          show={this.state.openUpdate}
          onHide={this.closeUpdate}
          keyboard={true}
        >
          <Modal.Body className="add-modal">
            <UpdateParent
              id={parent._id.$oid}
              parent={parent}
              callbackParent={this.onParentChanged}
            />
          </Modal.Body>
        </Modal>

        <Modal show={this.state.openCon} onHide={this.closeCon} keyboard={true}>
          <Modal.Body className="add-modal">
            <AddConnection
              id={parent._id.$oid}
              parent={parent}
              callbackParent={this.onChildChanged}
            />
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default ParentListItem
