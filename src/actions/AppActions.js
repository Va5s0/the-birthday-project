import AppDispatcher from "../dispatcher/AppDispatcher"
import AppConstants from "../constants/AppConstants"
import ParentsAPI from "../utils/ParentsAPI"
import NamesAPI from "../utils/NamesAPI"
import secrets from "../secrets"

export default {
  getParents: () => {
    ParentsAPI.getParents(
      "https://bday-59dee.firebaseio.com/users/vassog/contacts.json"
    )
      .then((parents) => {
        AppDispatcher.dispatch({
          actionType: AppConstants.GET_PARENTS,
          parents: parents,
        })
      })
      .catch((message) => {
        AppDispatcher.dispatch({
          message: message.message,
        })
        console.log("message: ", message)
      })
  },
  addParent: (parent) => {
    ParentsAPI.addParent(
      "https://api.mlab.com/api/1/databases/birthdayproject/collections/parents?apiKey=" +
        secrets.token,
      parent
    )
      .then((parent) => {
        AppDispatcher.dispatch({
          actionType: AppConstants.ADD_PARENT,
          parent: parent,
        })
      })
      .catch((message) => {
        AppDispatcher.dispatch({
          message: message,
        })
      })
  },
  updateParent: (id, parent) => {
    ParentsAPI.updateParent(
      "https://api.mlab.com/api/1/databases/birthdayproject/collections/parents/" +
        id +
        "?apiKey=" +
        secrets.token,
      parent
    )
      .then((parent) => {
        AppDispatcher.dispatch({
          actionType: AppConstants.UPDATE_PARENT,
          id: id,
          parent: parent,
        })
      })
      .catch((message) => {
        AppDispatcher.dispatch({
          message: message,
        })
      })
  },
  deleteParent: (id) => {
    ParentsAPI.deleteParent(
      "https://api.mlab.com/api/1/databases/birthdayproject/collections/parents/" +
        id +
        "?apiKey=" +
        secrets.token
    )
      .then((parent) => {
        AppDispatcher.dispatch({
          actionType: AppConstants.DELETE_PARENT,
          id: id,
        })
      })
      .catch((message) => {
        AppDispatcher.dispatch({
          message: message,
        })
      })
  },
  getNames: () => {
    NamesAPI.getNames("names/recurring_namedays.json")
      .then((names) => {
        AppDispatcher.dispatch({
          actionType: AppConstants.GET_NAMES,
          names: names.data,
        })
      })
      .catch((message) => {
        AppDispatcher.dispatch({
          message: message,
        })
      })
  },
  getEasterNames: () => {
    NamesAPI.getNames("names/relative_to_easter.json")
      .then((easterNames) => {
        AppDispatcher.dispatch({
          actionType: AppConstants.GET_EASTERNAMES,
          easterNames: easterNames.special,
        })
      })
      .catch((message) => {
        AppDispatcher.dispatch({
          message: message,
        })
      })
  },
  getSpecialEasterNames: () => {
    NamesAPI.getNames("names/recurring_special_namedays.json")
      .then((specialEasterNames) => {
        AppDispatcher.dispatch({
          actionType: AppConstants.GET_SPECIALEASTERNAMES,
          specialEasterNames: specialEasterNames.data,
        })
      })
      .catch((message) => {
        AppDispatcher.dispatch({
          message: message,
        })
      })
  },
}
