import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, Col, Thumbnail, Modal, Row, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import AppActions from '../actions/AppActions';
import AddConnection from './AddConnection';
import UpdateParent from './UpdateParent';
import ConnectionListItem from './ConnectionListItem';



class ParentListItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      openUpdate: false,
      openParent: false,
      openCon: false,
      parent: this.props.parent,
      }
  }

  closeParent() {
   this.setState({ openParent: false })
  }

  openParent() {
    this.setState({ openParent: true })
  }

  closeUpdate() {
   this.setState({ openUpdate: false })
  }

  openUpdate() {
    this.setState({ openUpdate: true })
  }

  closeCon() {
   this.setState({ openCon: false })
  }

  openCon() {
    this.setState({ openCon: true })
  }

  handleDeleteClick(id){
    AppActions.deleteParent(id);
  }

  onChildChanged(id, connections){
    var parent = this.props.parent;
    parent.connections = connections;
    this.setState({parent: parent}, function(){
      AppActions.updateParent(id, this.state.parent);
    });
    this.closeCon();
  }

  onParentChanged(id, parent){
    AppActions.updateParent(id, parent);
    this.closeUpdate();
  }

  render() {
    const {parent} = this.props;

    const tooltip = (
      <Tooltip id="modal-tooltip">
        Add {parent.firstName}'s connections
      </Tooltip>
    );

    let connectionListItems;
    if(parent.connections.length !== 0){
      connectionListItems = parent.connections.map(connection => {
        return (
          <ConnectionListItem key={connection.id} connection={connection} index={parent.connections.indexOf(connection)} parent={parent} id={parent._id.$oid} callbackParent={this.onChildChanged.bind(this)}/>
        );
      });
    } else {
      connectionListItems = <ConnectionListItem parent={parent} id={parent._id.$oid}/>
    };

    return (
      <div>
        <Col xs={6} md={4}>
          <Thumbnail src="images/profile-icon-png-917.png" alt="10x10">
            <h3 style={{cursor: 'pointer'}} onClick={ ()=> this.setState({ openParent: !this.state.openParent })}>{parent.firstName} {parent.lastName}</h3>
            <p>
              <Button className="custom" onClick={this.handleDeleteClick.bind(this, parent._id.$oid)}> <Glyphicon glyph="glyphicon glyphicon-remove"/> </Button>&nbsp;
              <Button className="custom" onClick={this.openUpdate.bind(this)}> <Glyphicon glyph="glyphicon glyphicon-pencil"/> </Button>&nbsp;
              <Button className="custom" onClick={this.openCon.bind(this)}> <OverlayTrigger overlay={tooltip}><Glyphicon glyph="glyphicon glyphicon-user"/></OverlayTrigger> </Button>
            </p>
            <Modal show={this.state.openParent} onHide={this.closeParent.bind(this)} keyboard={true} >

              <Modal.Header>
                <Modal.Title>{parent.firstName} {parent.lastName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <ListGroup>
                  <ListGroupItem><img src="images/phone.png" className='glyph' width='35px' role="presentation"/> {parent.phone}</ListGroupItem>
                  <ListGroupItem><img src="images/mail-ru.png" className='glyph' width='35px' role="presentation"/> {parent.email}</ListGroupItem>
                  <ListGroupItem><img src="images/cake-layered.png" className='glyph' width='35px' role="presentation"/> {parent.birthday}</ListGroupItem>
                  <ListGroupItem><img src="images/calendar.png" className='glyph' width='35px' role="presentation"/> {parent.nameday}</ListGroupItem>
                </ListGroup>

                <Row>
                  <div>
                    {connectionListItems}
                  </div>
                </Row>

              </Modal.Body>
              <Modal.Footer>
                <Button className="custom" onClick={this.closeParent.bind(this)}>Close</Button>
              </Modal.Footer>

            </Modal>
          </Thumbnail>
        </Col>

        <Modal show={this.state.openUpdate} onHide={this.closeUpdate.bind(this)} keyboard={true}>
          <Modal.Body>
            <UpdateParent id={parent._id.$oid} parent={parent} callbackParent={this.onParentChanged.bind(this)}/>
          </Modal.Body>
        </Modal>

        <Modal show={this.state.openCon} onHide={this.closeCon.bind(this)} keyboard={true}>
          <Modal.Body>
            <AddConnection id={parent._id.$oid} parent={parent} callbackParent={this.onChildChanged.bind(this)}/>
          </Modal.Body>
        </Modal>

      </div>
    );
  }

}

export default ParentListItem;
