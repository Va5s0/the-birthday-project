import React, { Component } from 'react';
import AppActions from '../actions/AppActions';
import AppStore from '../stores/AppStore';
import { FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Easter from './Easter';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';


class Nameday extends Component {
  constructor(){
    super();
    this.state = {
      saints: AppStore.getNames(),
      easterSaints: AppStore.getEasterNames(),
      specialEasterSaints: AppStore.getSpecialEasterNames(),
      newDate: '',
    }
    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOption = this.handleOption.bind(this)
  }

  componentWillMount(){
    AppStore.addChangeListener(this.onChange);
  }

  componentDidMount(){
    AppActions.getNames();
    AppActions.getEasterNames();
    AppActions.getSpecialEasterNames();
  }

  componentWillUnmount(){
    AppStore.removeChangeListener(this.onChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state!==nextState || this.props.name!==nextProps.name ){
      return true
    } else {
      return false
    }
  }

  onChange(){
    this.setState({
      saints: AppStore.getNames(),
      easterSaints: AppStore.getEasterNames(),
      specialEasterSaints: AppStore.getSpecialEasterNames()
    });
  }

  // passes the target value to the linked component ('AddParent', 'AddConnection', 'UpdateParent', 'EditConnection') every time the value changes
  handleOption(e) {
    this.props.callbackNameday(e.target.value);
  }

  // handler to control date change of DatePicker
  handleChange(selected) {
    this.setState({newDate: selected});

    // formats the selection to a uniform type of DD/MM
    let newNameday
    if(typeof selected === 'object') {
      newNameday = selected.format().toString().slice(8,10)+'/'+selected.format().toString().slice(5,7)
    } else {
      newNameday = selected
    };
    // passes the DatePicker selection to the linked component ('AddParent', 'AddConnection', 'UpdateParent', 'EditConnection') every time the value changes
    this.props.callbackNameday(newNameday);
   }


  render() {

    let firstName = this.props.name; // updates the first name of the parent or the parent connection
    let dates = [];
    let easterDates = [];
    let option;
    let options;
    let now = moment().year();
    let existingDate;

    // fills the form with the current date (used at the 'UpdateParent' and 'EditConnection' components)
    if (this.props.date){
      existingDate = this.props.date;
    } else {
      existingDate = "";
    }

    // checks if there is an existing first name
    if (firstName!==""){
      // maps the 'recurring_namedays' json file
      this.state.saints.map((saint, i) => {
        saint.names.map((name, j) => {
          if (name === firstName) {
            dates.push(saint.date);
          }
          return dates;
        });
        return null;
      });
      // maps the 'relative_to_easter' json file
      this.state.easterSaints.map((easterSaint, l) => {
        easterSaint.variations.map((easterName, m) => {
          if (easterName === firstName) {
            easterDates.push(easterSaint.toEaster);
            dates.push([moment(Easter(now).props.children).add(easterDates[0], 'day').format('DD/MM')]);
          }
          return dates;
        })
        return null;
      });
      // maps the 'recurring_special_namedays' json file
      this.state.specialEasterSaints.map((saint, i) => {
        saint.names.map((name, j) => {
          if (name === firstName) {

            var special_saint = moment([(moment().get('year')), 0, parseInt(saint.date.slice(0, 2), 10)]);
            var easter = moment([(moment().get('year')), 0, parseInt((moment(Easter(now).props.children).format('DD/MM/YYYY')).slice(0, 2), 10)]);
            if (easter.diff(special_saint, 'days') >= 0) {
              easterDates.push(saint.toEaster);
              dates.push([moment(Easter(now).props.children).add(easterDates[0], 'day').format('DD/MM')]);
            } else {
              dates.push(saint.date);
            }
          }
          return dates;
        });
        return null;
      });

      // fills the dropdown selection form dynamically based on the 'dates' array
      if(dates.length>0) {
        options = dates.map((date, k) => {
          return (
            <option key={k} value={date}>{date}</option>
          );
        });
        option =
          <FormControl
            onChange={this.handleOption}
            onFocus={this.handleOption}
            componentClass="select"
            placeholder="Add NameDay"
            defaultValue={existingDate}
          >
            {options}
          </FormControl>
      }else {
        // activates the DatePicker dropdown if the json files search has no results
        option = <DatePicker
          selected={existingDate ? moment(existingDate, 'DD/MM') : this.state.newDate}
          onChange={this.handleChange}
          dateFormat="DD/MM"
          className="form-control"
          placeholderText="Add NameDay"
        />;
      }
    } else {
      // activates the DatePicker dropdown if the first name field is empty
      option = <DatePicker
        selected={this.state.newDate}
        onChange={this.handleChange}
        dateFormat="DD/MM"
        className="form-control"
        placeholderText="Add NameDay"
      />;
    };

    return (
      option
    );
  }
}

export default Nameday;
