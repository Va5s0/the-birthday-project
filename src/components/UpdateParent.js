import React, { Component } from 'react';
import {Panel, FormGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import Nameday from './Nameday';
import update from 'react-addons-update';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class UpdateParent extends Component {
  constructor(props){
    super(props);
    this.state = {
      date: this.props.parent.birthday,
      newNamedate: this.props.parent.date, // variable that updates through the 'Nameday' component and fills the form with the current nameday
      controlId: null,
      validationState_phone: null,
      validationState_email: null,
      newNameday_id: '',
      nameChange: this.props.parent.firstName, // variable passed to the 'Nameday' component that fills the form with the current name and updates every time the firstName changes
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onNamedayChange = this.onNamedayChange.bind(this);
  }

  // handler to control date change of DatePicker
  handleChange(selected) {
    this.setState({
      date: selected,
    })
   }

   // handler to update the nameChange variable every time the first name changes
   handleNameChange(value) {
     this.setState({nameChange: this.firstName.value})
   }

   // handler to update the newNamedate variable each time a new date is selected in the 'Nameday' component
   onNamedayChange(date, id){
     this.setState({
       newNameday_id: id,
       newNamedate: date
     });
   }

  handleSubmit(e, id){
    // name, phone, email validation
    const pattern_name = /^\s+$/;
    const pattern_phone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const pattern_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // sets the birthday date format to a uniform type of DD/MM/YYYY
    let newBirthday
    if(typeof this.state.date === 'object') {
      newBirthday = this.state.date.format().toString().slice(8,10)+'-'+this.state.date.format().toString().slice(5,7)+'-'+this.state.date.format().toString().slice(0,4)
    } else {
      newBirthday = this.state.date
    }

    let parent = this.props.parent;

    if((pattern_name.test(this.firstName.value) || this.firstName.value === "") && (pattern_name.test(this.lastName.value) || this.lastName.value === "")){
      alert('Name is required');
      if (!pattern_phone.test(this.phone.value) && this.phone.value!=="" && !pattern_email.test(this.email.value) && this.email.value!==""){
        this.setState({controlId_phone: "formValidationError1", validationState_phone: "error", controlId_email: "formValidationError1", validationState_email: "error"});
      } else if ((pattern_phone.test(this.phone.value) || this.phone.value === "") && !pattern_email.test(this.email.value) && this.email.value!==""){
        this.setState({controlId_phone: null, validationState_phone: null, controlId_email: "formValidationError1", validationState_email: "error"})
      } else if ((pattern_email.test(this.email.value) || this.email.value === "") && !pattern_phone.test(this.phone.value) && this.phone.value!==""){
        this.setState({controlId_phone: "formValidationError1", validationState_phone: "error", controlId_email: null, validationState_email: null})
      } else (
        this.setState({controlId_phone: null, validationState_phone: null, controlId_email: null, validationState_email: null})
      )
    } else if (!pattern_phone.test(this.phone.value) && this.phone.value!=="" && !pattern_email.test(this.email.value) && this.email.value!==""){
      this.setState({controlId_phone: "formValidationError1", validationState_phone: "error", controlId_email: "formValidationError1", validationState_email: "error"});
    } else if ((pattern_phone.test(this.phone.value) || this.phone.value === "") && !pattern_email.test(this.email.value) && this.email.value!==""){
      this.setState({controlId_phone: null, validationState_phone: null, controlId_email: "formValidationError1", validationState_email: "error"})
    } else if ((pattern_email.test(this.email.value) || this.email.value === "") && !pattern_phone.test(this.phone.value) && this.phone.value!==""){
      this.setState({controlId_phone: "formValidationError1", validationState_phone: "error", controlId_email: null, validationState_email: null})
    } else {

      let newParent = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        phone: this.phone.value,
        email: this.email.value,
        birthday: newBirthday,
        nameday: {
          nameday_id: this.state.newNameday_id,
          date: this.state.newNamedate,
        },
      };
      parent = update(parent, {$merge: newParent});
      this.setState({
        controlId_phone: null,
        controlId_email: null,
        validationState_phone: null,
        validationState_email: null,
      });
      this.props.callbackParent(this.props.id, parent);
    };

    e.preventDefault();
  }

  render() {
    const {parent} = this.props;

    var datePickerDate
    if (this.state.date.length>0) {
      datePickerDate =
      <InputGroup>
        <InputGroup.Addon className='glyph-input'><img src="images/cake-layered.png" width='20px' role="presentation"/></InputGroup.Addon>
          <DatePicker
            openToDate={moment(parent.birthday, "DD-MM-YYYY")}
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
            placeholderText="Add Birthday"
          />
        </InputGroup>
      }

    return (
      <div>
        <div className='font30'>
          Edit
        </div>

        <Panel>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/account.png" width='20px' role="presentation" /></InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add First Name"
                  defaultValue={parent.firstName}
                  inputRef={(ref) => {this.firstName = ref}}
                  onBlur={this.handleNameChange}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/account.png" width='20px' role="presentation" /></InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Last Name"
                  defaultValue={parent.lastName}
                  inputRef={(ref) => {this.lastName = ref}}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup controlId={this.state.controlId_phone} validationState={this.state.validationState_phone}>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/phone.png" width='20px' role="presentation"/></InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Phone Number"
                  defaultValue={parent.phone}
                  inputRef={(ref) => {this.phone = ref}}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup controlId={this.state.controlId_email} validationState={this.state.validationState_email}>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/mail-ru.png" width='20px' role="presentation"/></InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Email"
                  defaultValue={parent.email}
                  inputRef={(ref) => {this.email = ref}}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              {datePickerDate}
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/calendar.png" width='20px' role="presentation"/></InputGroup.Addon>
                <Nameday name={this.state.nameChange} callbackNameday={this.onNamedayChange} dateId={this.props.parent.nameday.nameday_id} date={this.props.parent.nameday.date} onList={false}/>
              </InputGroup>
            </FormGroup>

            <Button className="custom" type="submit">Save</Button>
          </form>
        </Panel>
      </div>

    );
  }
}

export default UpdateParent;
