import React, { Component } from 'react';
import {Panel, FormGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import Nameday from './Nameday';
import update from 'react-addons-update';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class EditConnection extends Component {
  constructor(props){
    super(props);
    this.state = {
      date: this.props.parent.connections[this.props.index].birthday,
      newNamedate: this.props.parent.connections[this.props.index].nameday.date, // variable that updates through the 'Nameday' component and fills the form with the current connection nameday
      controlId: null,
      validationState: null,
      newNameday_id: '',
      nameChange: this.props.parent.connections[this.props.index].name, // variable passed to the 'Nameday' component that fills the form with the current connection name and updates every time the name changes
    }
    this.onNamedayChange = this.onNamedayChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  // handler to control date change of DatePicker
  handleChange(selected) {
    this.setState({
      date: selected,
    })
   }

  // handler to update the nameChange variable every time the connection name changes
  handleNameChange(value) {
   this.setState({nameChange: this.name.value});
  }

  // handler to update the newNamedate variable each time a new date is selected in the 'Nameday' component
  onNamedayChange(date, id){
    this.setState({
      newNameday_id: id,
      newNamedate: date
    });
  }

  handleSubmit(e){
    // name, phone validation
    const pattern_name = /^\s+$/;
    const pattern_phone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    // sets the birthday date format to a uniform type of DD/MM/YYYY
    let newBirthday
    if(typeof this.state.date === 'object') {
      newBirthday = this.state.date.format().toString().slice(8,10)+'-'+this.state.date.format().toString().slice(5,7)+'-'+this.state.date.format().toString().slice(0,4)
    } else {
      newBirthday = this.state.date
    }

    let connections
    if(pattern_name.test(this.name.value) || this.name.value === ''){
      alert('Name is required');
      if (!pattern_phone.test(this.phone.value) && this.phone.value!==""){
        this.setState({controlId: "formValidationError1", validationState: "error"})
      } else {
        this.setState({controlId: null, validationState: null})
      }
    } else if (!pattern_phone.test(this.phone.value) && this.phone.value!==""){
      this.setState({controlId: "formValidationError1", validationState: "error"})
    } else {
      connections = update(this.props.parent.connections, {$splice: [[this.props.index, 1]]});
      let newConnection = {
        id: this.props.parent.connections[this.props.index].id,
        name: this.name.value,
        phone: this.phone.value,
        birthday: newBirthday,
        nameday: {
          nameday_id: this.state.newNameday_id,
          date: this.state.newNamedate,
        },
      };
      connections = [ ...connections, newConnection];
      this.setState({
        controlId: null,
        validationState: null,
      });
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
            onChange={this.handleChange}
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
            onChange={this.handleChange}
            dateFormat="DD/MM/YYYY"
            className="form-control"
            placeholderText="Add Connection's Birthday"
          />
        </InputGroup>
      }

    return (
      <div>
        <Panel>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/account.png" width='20px' role="presentation" /></InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Connection's Name"
                  defaultValue={this.props.parent.connections[this.props.index].name}
                  inputRef={(ref) => {this.name = ref}}
                  onBlur={this.handleNameChange}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup controlId={this.state.controlId} validationState={this.state.validationState}>
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
                  <Nameday name={this.state.nameChange} callbackNameday={this.onNamedayChange} dateId={this.props.parent.connections[this.props.index].nameday.nameday_id} date={this.props.parent.connections[this.props.index].nameday.date} onList={false}/>
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
