import React, { Component } from 'react';
import {Panel, FormGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import update from 'react-addons-update';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

class UpdateParent extends Component {
  constructor(props){
    super(props);
    this.state = {
      date: this.props.parent.birthday,
    }
  }

  handleChange(selected) {
    this.setState({
      date: selected,
    })
   }

  handleSubmit(e, id){
    let newBirthday
    if(typeof this.state.date === 'object') {
      newBirthday = this.state.date.format().toString().slice(8,10)+'-'+this.state.date.format().toString().slice(5,7)+'-'+this.state.date.format().toString().slice(0,4)
    } else {
      newBirthday = this.state.date
    }

    let parent = this.props.parent;

    if(this.firstName.value === '' && this.lastName.value === ''){
      alert('Name is required')
    } else {

      let newParent = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        phone: this.phone.value,
        email: this.email.value,
        birthday: newBirthday,
        nameday: this.nameday.value,
      };
      parent = update(parent, {$merge: newParent});
    };
    this.props.callbackParent(this.props.id, parent);
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
          <form onSubmit={this.handleSubmit.bind(this)}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className='glyph-input'><img src="images/account.png" width='20px' role="presentation" /></InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add First Name"
                  defaultValue={parent.firstName}
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
                    defaultValue={parent.lastName}
                    inputRef={(ref) => {this.lastName = ref}}
                  />
              </InputGroup>
            </FormGroup>
            <FormGroup>
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
            <FormGroup>
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
                  <FormControl
                    type="text"
                    placeholder="Add NameDay"
                    defaultValue={parent.nameday}
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

export default UpdateParent;
