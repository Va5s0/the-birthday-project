import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import ParentsAPI from '../utils/ParentsAPI';

export default {
  getParents: () => {
    ParentsAPI
      .getParents('https://api.mlab.com/api/1/databases/birthdayproject/collections/parents?apiKey=7h7WFz9NpTzyTnoLwQRQxjEoZxdiahln')
      .then(parents => {
        AppDispatcher.dispatch({
          actionType: AppConstants.GET_PARENTS,
          parents: parents
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          message: message
        });
      });
  },
	addParent: (parent) => {
  	ParentsAPI
  		.addParent('https://api.mlab.com/api/1/databases/birthdayproject/collections/parents?apiKey=7h7WFz9NpTzyTnoLwQRQxjEoZxdiahln', parent)
  		.then(parent => {
  			AppDispatcher.dispatch({
  				actionType: AppConstants.ADD_PARENT,
  				parent: parent
  			});
  		})
  		.catch(message => {
  			AppDispatcher.dispatch({
  				message: message
  			});
  		});
	},
  updateParent: (id, parent) => {
  	ParentsAPI
  		.updateParent('https://api.mlab.com/api/1/databases/birthdayproject/collections/parents/'+id+'?apiKey=7h7WFz9NpTzyTnoLwQRQxjEoZxdiahln', parent)
  		.then(parent => {
  			AppDispatcher.dispatch({
  				actionType: AppConstants.UPDATE_PARENT,
  				id: id,
          parent: parent
  			});
  		})
  		.catch(message => {
  			AppDispatcher.dispatch({
  				message: message
  			});
  		});
	},
	deleteParent: (id) => {
	  ParentsAPI
	    .deleteParent('https://api.mlab.com/api/1/databases/birthdayproject/collections/parents/'+id+'?apiKey=7h7WFz9NpTzyTnoLwQRQxjEoZxdiahln')
	    .then(parent => {
	      AppDispatcher.dispatch({
	        actionType: AppConstants.DELETE_PARENT,
	        id: id
	      });
	    })
      .catch(message => {
        AppDispatcher.dispatch({
          message: message
        });
      });
	 }
}
