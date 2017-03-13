import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

var AppActions = {
  //Examples

  // searchMovies(movie){
  //   AppDispatcher.handleViewAction({
  //     actionType: AppConstants.SEARCH_MOVIES,
  //     movie: movie
  //
  //   })
  // },
  // receiveMovieResults(movies){
  //   AppDispatcher.handleViewAction({
  //     actionType: AppConstants.RECEIVE_MOVIE_RESULTS,
  //     movies: movies
  //   })
  // }
  // 
  addMovies(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD
    })
  },
  clearMovies(){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.CLEAR
    })
  }
}


export default AppActions;
