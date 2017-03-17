import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import { EventEmitter } from 'events';
import { ajaxUtility } from '../utils/ajaxPromise';
import AppAPI from '../utils/appAPI';
const CHANGE_EVENT = 'change';
var matches = null;

function setScores(response){
    console.log(response);
    matches = response;
    AppStore.emitChange();
}

function hitScoreAPI(){
    var promiseObject = ajaxUtility('http://127.0.0.1:8000/scorescrap/get_scores');
    promiseObject.then(response => setScores(response));
}

class AppStoreClass extends EventEmitter {
    getInitialData(){
        hitScoreAPI();
    }
    pollMatches(){
        setInterval(hitScoreAPI,10000);
    }
    getMatches(){
        return matches;
    }
    emitChange() {
        this.emit(CHANGE_EVENT);
    }
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

AppDispatcher.register((payload) => {
    const action = payload.action;
    switch (action.actionType) {
        case AppConstants.POLL_MATCHES:
        AppStore.pollMatches();
        break;        
        case AppConstants.GET_MATCHES:
        AppStore.getInitialData();
        break;        
    }
    return true
});

// Initialize the singleton to register with the
// dispatcher and export for React components
const AppStore = new AppStoreClass();

export default AppStore;
