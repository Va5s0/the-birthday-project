import React, { Component } from 'react';
import AppActions from '../actions/AppActions';
import AppStore from '../stores/AppStore';
import { ListGroupItem } from 'react-bootstrap';
import Easter from './Easter';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';


class NamedayListGroup extends Component {
  constructor(props){
    super(props);
    this.state = {
      saints: AppStore.getNames(),
      easterSaints: AppStore.getEasterNames(),
      specialEasterSaints: AppStore.getSpecialEasterNames(),
      newDate: this.props.date,
      value: this.props.dateId,
    }
  }

  componentWillMount(){
    AppStore.addChangeListener(this.onChange);
  }

  componentDidMount(){
    AppActions.getNames();
    AppActions.getEasterNames();
    AppActions.getSpecialEasterNames();
    this._isMounted = true;
  }

  onChange = () => {
    if (this._isMounted) {
      this.setState({
        saints: AppStore.getNames(),
        easterSaints: AppStore.getEasterNames(),
        specialEasterSaints: AppStore.getSpecialEasterNames(),
      });
    }
  }

  componentWillUnmount(){
    AppStore.removeChangeListener(this.onChange);
    this._isMounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state!==nextState || this.props.name!==nextProps.name || this.props.date!==nextProps.date){
      return true
    } else {
      return false
    }
  }

  handleGroupItemParent = changedDate => {
    if(changedDate && !this._isMounted) {
      this.props.callbackNamedayParent(moment(changedDate, "DD/MM/YYYY"), this.props.dateId, this.props.parent, this.props.index);
    }
  }

  handleGroupItemChild = changedDate => {
    if(changedDate) {
      this.props.callbackNamedayChild(moment(changedDate, "DD/MM/YYYY"), this.props.dateId, this.props.parent, this.props.index);
    }
  }

  render() {
    let firstName = this.props.name; // updates the first name of the parent or the parent connection
    let dates = [];
    let easterDates = [];
    let option;
    let now = moment().get('year');

    // checks if there is a listed name (this.state.value == '10' --> name isn't listed )
    if (this.state.value!=='10'){
      // searches the 'recurring_namedays' json file
      this.state.saints.forEach((saint, i) => {
        saint.names.forEach((name, j) => {
          if (name === firstName) {
            dates.push(saint.date+'/'+now);
          } return dates;
        });
        return null
      });
      // searches the 'relative_to_easter' json file
      this.state.easterSaints.forEach((easterSaint, l) => {
        easterSaint.variations.forEach((easterName, m) => {
          if (easterName === firstName) {
            easterDates.push(easterSaint.toEaster);
            dates.push(moment(Easter(now).props.children).add(easterDates[0], 'day').format('DD/MM/YYYY'));
          } return dates;
        });
        return null
      });
      // searches the 'recurring_special_namedays' json file
      this.state.specialEasterSaints.forEach((saint, i) => {
        saint.names.forEach((name, j) => {
          if (name === firstName) {
            var special_saint = moment([(moment().get('year')), 0, parseInt(saint.date.slice(0, 2), 10)]);
            var easter = moment([(moment().get('year')), 0, parseInt((moment(Easter(now).props.children).format('DD/MM/YYYY')).slice(0, 2), 10)]);
            if (easter.diff(special_saint, 'days') >= 0) {
              easterDates.push(saint.toEaster);
              dates.push(moment(Easter(now).props.children).add(easterDates[0], 'day').format('DD/MM/YYYY'));
            } else {
              dates.push(saint.date+'/'+now);
            }
          } return dates;
        });
        return null
      });

      // replaces the existing listed date with the correct one based on the current year results
      if (this.state.newDate !== '') {
        if(this.props.child === false) {
          this.handleGroupItemParent(dates[this.state.value]);
          option = <ListGroupItem ><img src="images/calendar.png" className='glyph' width='35px' role="presentation"/> {dates[this.state.value]} </ListGroupItem>
        } else {
          this.handleGroupItemChild(dates[this.state.value]);
          option = <ListGroupItem ><img src="images/calendar.png" className='glyph' width='35px' role="presentation"/> {dates[this.state.value]} </ListGroupItem>
        }
        // if there is no existing date, it takes no action
      } else {
          option = <ListGroupItem><img src="images/calendar.png" className='glyph' width='35px' role="presentation"/> {this.state.newDate} </ListGroupItem>
      }

    // if there is NOT a listed name (this.state.value == '10' --> name isn't listed) replaces ONLY the year of the existing listed date with the current year
    } else{
      if (this.state.newDate !== '') {
        if(this.props.child === false){
          this.handleGroupItemParent(moment(this.state.newDate).format('DD/MM')+'/'+now);
          option = <ListGroupItem ><img src="images/calendar.png" className='glyph' width='35px' role="presentation"/> {moment(this.state.newDate).format('DD/MM')+'/'+now} </ListGroupItem>
        } else {
          this.handleGroupItemChild(moment(this.state.newDate).format('DD/MM')+'/'+now);
          option = <ListGroupItem ><img src="images/calendar.png" className='glyph' width='35px' role="presentation"/> {moment(this.state.newDate).format('DD/MM')+'/'+now} </ListGroupItem>
        }
      // if there is no existing date, it takes no action
      } else {
        option = <ListGroupItem><img src="images/calendar.png" className='glyph' width='35px' role="presentation"/> {this.state.newDate} </ListGroupItem>
      }
    }

    return (
      option
    )
  }
}

export default NamedayListGroup;
