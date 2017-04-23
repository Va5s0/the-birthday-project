import React, { Component } from 'react';
import {Panel, FormGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import update from 'react-addons-update';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class EditConnection extends Component {
  constructor(props){
    super(props);
    this.state = {
      date: this.props.parent.connections[this.props.index].birthday,
    }
  }

  handleChange(selected) {
    this.setState({
      date: selected,
    })
   }

  handleSubmit(e){
    let newBirthday
    if(typeof this.state.date === 'object') {
      newBirthday = this.state.date.format().toString().slice(8,10)+'-'+this.state.date.format().toString().slice(5,7)+'-'+this.state.date.format().toString().slice(0,4)
    } else {
      newBirthday = this.state.date
    }

    let connections
    if(this.name.value === ''){
      alert('Name is required')
    } else {
      connections = update(this.props.parent.connections, {$splice: [[this.props.index, 1]]});
      let newConnection = {
        id: this.props.parent.connections[this.props.index].id,
        name: this.name.value,
        phone: this.phone.value,
        birthday: newBirthday,
        nameday: this.nameday.value,
      };
      connections = [ ...connections, newConnection];
      this.props.callbackParent(this.props.id, connections);
    }
    e.preventDefault();
  }

  render() {
    var datePickerDate
    if (this.state.date.length>0) {
      datePickerDate =
        <InputGroup>
          <InputGroup.Addon className='glyph-input'><img src="images/cake-layered.png" width='20px' role="presentation"/></InputGroup.Addon>
          <DatePicker
            openToDate={moment(this.props.parent.connections[this.props.index].birthday, "DD-MM-YYYY")}
            selected={moment(this.state.date, "DD-MM-YYYY")}
            onChange={this.handleChange.bind(this)}
            dateFormat="DD/MM/YYYY"
            className="form-control"
            />
          </InputGroup>
    } else {
      datePickerDate =
        <InputGroup>
          <InputGroup.Addon className='glyph-input'><img src="images/cake-layered.png" width='20px' role="presentation"/></InputGroup.Addon>
          <DatePicker
            selected={this.state.date}
            onChange={this.handleChange.bind(this)}
            dateFormat="DD/MM/YYYY"
            className="form-control"
            placeholderText="Add Connection's Birthday"
          />
        </InputGroup>
      }

    return (
      <div>
        <Panel>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/account.png" width='20px' role="presentation" /></InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Connection's Name"
                  defaultValue={this.props.parent.connections[this.props.index].name}
                  inputRef={(ref) => {this.name = ref}}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/phone.png" width='20px' role="presentation"/></InputGroup.Addon>
                  <FormControl
                    type="text"
                    placeholder="Add Connection's Phone Number"
                    defaultValue={this.props.parent.connections[this.props.index].phone}
                    inputRef={(ref) => {this.phone = ref}}
                  />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              {datePickerDate}
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/calendar.png" width='20px' role="presentation"/></InputGroup.Addon>
                  <FormControl
                    type="text"
                    placeholder="Add Connection's Nameday"
                    defaultValue={this.props.parent.connections[this.props.index].nameday}
                    inputRef={(ref) => {this.nameday = ref}}
                  />
              </InputGroup>
            </FormGroup>

            <Button className="custom" type="submit">Save</Button>
          </form>
        </Panel>
      </div>
    );
  }
}

export default EditConnection;
