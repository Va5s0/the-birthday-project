import AppDispatcher from "../dispatcher/AppDispatcher"
import AppConstants from "../constants/AppConstants"
import { EventEmitter } from "events"

const CHANGE_EVENT = "change"

class AppStoreClass extends EventEmitter {
  constructor() {
    super()
    this.parents = []
    this.names = []
    this.easterNames = []
    this.specialEasterNames = []
  }

  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  getParents() {
    return this.parents
  }

  addParent(parent) {
    this.parents.splice(0, 0, parent)
  }

  updateParent(id, parent) {
    var index = this.parents.findIndex(x => x._id.$oid === id)
    this.parents.splice(index, 1, parent)
  }

  deleteParent(id) {
    var index = this.parents.findIndex(x => x._id.$oid === id)
    this.parents.splice(index, 1)
  }

  getNames() {
    return this.names
  }

  getEasterNames() {
    return this.easterNames
  }

  getSpecialEasterNames() {
    return this.specialEasterNames
  }
}

const AppStore = new AppStoreClass()

AppStore.dispatchToken = AppDispatcher.register(action => {
  switch (action.actionType) {
    case AppConstants.GET_PARENTS:
      // Store Save
      AppStore.parents = action.parents
      // Emit Change
      AppStore.emitChange()
      break

    case AppConstants.ADD_PARENT:
      // Store Save
      AppStore.addParent(action.parent)
      // Emit Change
      AppStore.emitChange()
      break

    case AppConstants.UPDATE_PARENT:
      // Store Save
      AppStore.updateParent(action.id, action.parent)
      // Emit Change
      AppStore.emitChange()
      break

    case AppConstants.DELETE_PARENT:
      // Store Remove
      AppStore.deleteParent(action.id)
      // Emit Change
      AppStore.emitChange()
      break

    case AppConstants.GET_NAMES:
      // Store Save
      AppStore.names = action.names
      // Emit Change
      AppStore.emitChange()
      break

    case AppConstants.GET_EASTERNAMES:
      // Store Save
      AppStore.easterNames = action.easterNames
      // Emit Change
      AppStore.emitChange()
      break

    case AppConstants.GET_SPECIALEASTERNAMES:
      // Store Save
      AppStore.specialEasterNames = action.specialEasterNames
      // Emit Change
      AppStore.emitChange()
      break

    default: {
      console.log("No such handler")
    }
  }
})

export default AppStore
