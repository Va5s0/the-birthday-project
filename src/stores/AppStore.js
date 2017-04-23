import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import {EventEmitter} from 'events';

const CHANGE_EVENT ='change';

let _parents = [];

function setParents(parents){
  _parents = parents;
}

function addParent(parent){
  _parents.splice(0,0,parent);
}

function updateParent(id, parent){
  var index = _parents.findIndex(x => x._id.$oid === id);
  _parents.splice(index, 1, parent);
}

function deleteParent(id){
  var index = _parents.findIndex(x => x._id.$oid === id);
  _parents.splice(index, 1);
}

class AppStoreClass extends EventEmitter {
  emitChange(){
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback){
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback){
    this.removeListener(CHANGE_EVENT, callback);
  }

	getParents(){
		return _parents;
  }

}

const AppStore = new AppStoreClass();

AppStore.dispatchToken = AppDispatcher.register(action =>{
  switch(action.actionType){

    case AppConstants.ADD_PARENT:
      // Store Save
      addParent(action.parent);
      // Emit Change
      AppStore.emitChange();
      break;

    case AppConstants.UPDATE_PARENT:
      // Store Save
      updateParent(action.id, action.parent);
      // Emit Change
      AppStore.emitChange();
      break;

    case AppConstants.GET_PARENTS:
      // Store Save
      setParents(action.parents);
      // Emit Change
      AppStore.emitChange();
      break;

    case AppConstants.DELETE_PARENT:
      // Store Remove
      deleteParent(action.id);
      // Emit Change
      AppStore.emitChange();
      break;

    default: {
      console.log('No such handler');
    }
  }
});

export default AppStore;
