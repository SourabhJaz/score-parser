import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

var AppActions = {
  matchCall(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.POLL_MATCHES
    })
  },
  initialData(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.GET_MATCHES
    })    
  }
}


export default AppActions;
