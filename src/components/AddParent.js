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
      controlId: null,
      validationState: null,
    }
  }

  handleChange(selected) {
    this.setState({
      date: selected,
    })
   }

  handleSubmit(e){
    const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    let newBirthday
    if(typeof this.state.date === 'object') {
      newBirthday = this.state.date.format().toString().slice(8,10)+'-'+this.state.date.format().toString().slice(5,7)+'-'+this.state.date.format().toString().slice(0,4)
    } else {
      newBirthday = this.state.date
    }

    if(this.firstName.value === '' && this.lastName.value === ''){
      alert('Name is required')
    } else if (!pattern.test(this.phone.value) && this.phone.value!==""){
      this.setState({controlId: "formValidationError1", validationState: "error"})
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

      this.setState({controlId: null, validationState: null});
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
            <FormGroup controlId={this.state.controlId} validationState={this.state.validationState}>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/phone.png" width='20px' role="presentation"/></InputGroup.Addon>
                  <FormControl
                    type="text"
                    placeholder="Add Phone Number"
                    inputRef={(ref) => {this.phone = ref}}
                  />
              </InputGroup>
            </FormGroup>
            <FormGroup>
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
