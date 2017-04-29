import React, { Component } from 'react';
import { Panel, FormGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import AppActions from '../actions/AppActions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class AddParent extends Component {
  constructor(props){
    super(props);
    this.state = {
      newParent: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        birthday: '',
        nameday: '',
        connections: [{
          id: '',
          name: '',
          phone: '',
        }],
      },
      date: '',
      controlId_phone: null,
      controlId_email: null,
      validationState_phone: null,
      validationState_email: null,
    }
  }

  handleChange(selected) {
    this.setState({
      date: selected,
    })
   }

  handleSubmit(e){
    const pattern_name = /^\s+$/;
    const pattern_phone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const pattern_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let newBirthday
    if(typeof this.state.date === 'object') {
      newBirthday = this.state.date.format().toString().slice(8,10)+'-'+this.state.date.format().toString().slice(5,7)+'-'+this.state.date.format().toString().slice(0,4)
    } else {
      newBirthday = this.state.date
    }

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

      this.setState({
        newParent: {
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          phone: this.phone.value,
          email: this.email.value,
          birthday: newBirthday,
          nameday: this.nameday.value,
          connections: [],
        }
      }, function(){
        AppActions.addParent(this.state.newParent)
      });

      this.firstName.value = '';
      this.lastName.value = '';
      this.phone.value = '';
      this.email.value = '';
      this.nameday.value = '';

      this.setState({
        controlId_phone: null,
        controlId_email: null,
        validationState_phone: null,
        validationState_email: null,
      });
      this.props.callbackParent();
    }

    e.preventDefault();
  }

  render() {

    return (
      <div>
        <div className='font30'>
          Add a new friend
        </div>
        <Panel>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/account.png" width='20px' role="presentation" /></InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add First Name"
                  inputRef={(ref) => {this.firstName = ref}}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/account.png" width='20px' role="presentation" /></InputGroup.Addon>
                  <FormControl
                    type="text"
                    placeholder="Add Last Name"
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
                    inputRef={(ref) => {this.email = ref}}
                  />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/cake-layered.png" width='20px' role="presentation"/></InputGroup.Addon>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.handleChange.bind(this)}
                  dateFormat="DD/MM/YYYY"
                  className="form-control"
                  placeholderText="Add Birthday"
                  />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/calendar.png" width='20px' role="presentation"/></InputGroup.Addon>
                  <FormControl
                    type="text"
                    placeholder="Add NameDay"
                    inputRef={(ref) => {this.nameday = ref}}
                  />
              </InputGroup>
            </FormGroup>

            <Button className="custom" type="submit">Submit</Button>
          </form>
        </Panel>
      </div>
    );
  }
}

export default AddParent;
