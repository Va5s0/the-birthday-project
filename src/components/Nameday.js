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

  handleOption(e) {
    this.props.callbackNameday(e.target.value);
  }

  handleChange(selected) {
    this.setState({newDate: selected});

    let newNameday
    if(typeof selected === 'object') {
      newNameday = selected.format().toString().slice(8,10)+'/'+selected.format().toString().slice(5,7)
    } else {
      newNameday = selected
    };
    this.props.callbackNameday(newNameday);
   }


  render() {

    let firstName = this.props.name;
    let dates = [];
    let easterDates = [];
    let option;
    let options;
    let now = moment().year();
    let existingDate;

    if (this.props.date){
      existingDate = this.props.date;
    } else {
      existingDate = "";
    }

    if (firstName!==""){
      this.state.saints.map((saint, i) => {
        saint.names.map((name, j) => {
          if (name === firstName) {
            dates.push(saint.date);
          }
          return dates;
        });
        return null;
      });
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
        option = <DatePicker
          selected={existingDate ? moment(existingDate, 'DD/MM') : this.state.newDate}
          onChange={this.handleChange}
          dateFormat="DD/MM"
          className="form-control"
          placeholderText="Add NameDay"
        />;
      }
    } else {
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
