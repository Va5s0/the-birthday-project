import React, { Component } from 'react';
import ParentListItem from './ParentListItem';
import AppActions from '../actions/AppActions';
import AppStore from '../stores/AppStore';

// FIXME: remove AppActions from ComponentDidMount
class Parents extends Component {
  constructor(props){
    super(props);
    this.state = {
      parents: AppStore.getParents()
    }

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount(){
    AppStore.addChangeListener(this.onChange);
  }

  componentDidMount(){
    AppActions.getParents();
  }

  componentWillUnmount(){
    AppStore.removeChangeListener(this.onChange);
  }

  // FIXME: remove the function callback
  onChange(){
    this.setState({
      parents: AppStore.getParents()
    }, function(){
    });
  }

  render() {
    let parentListItems;

    if(this.state.parents){
      parentListItems = this.state.parents.map(parent => {
        return (
          <ParentListItem key={parent._id.$oid} parent={parent} />
        );
      });
    }
    return (
      <div>
        {parentListItems}
      </div>
    );
  }
}

export default Parents;
