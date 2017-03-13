import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import { EventEmitter } from 'events';
import AppAPI from '../utils/appAPI';
const CHANGE_EVENT = 'change';

//Example

let _movies = '';
// let _selected = '';



class AppStoreClass extends EventEmitter {
    //Example

    resetMovieResults(){
        _movies = '';
    }


    //Example

    addMovieResults(str){
        _movies=_movies+' '+str;
    }

    getMovieResults(){
                return _movies;
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {

        this.on('change', callback);

    }

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

}

AppDispatcher.register((payload) => {
    const action = payload.action;

    switch (action.actionType) {

        case AppConstants.ADD:
        AppStore.addMovieResults("This");
        AppStore.emit(CHANGE_EVENT);
        break;
        //
        case AppConstants.CLEAR:
        AppStore.resetMovieResults();
        AppStore.emit(CHANGE_EVENT);
        break;

    }
    return true

});

// Initialize the singleton to register with the
// dispatcher and export for React components
const AppStore = new AppStoreClass();

export default AppStore;
