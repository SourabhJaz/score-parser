import React from 'react';
import AppActions from '../actions/AppActions';
import AppStore from '../stores/AppStore';
// import SearchForm from './SearchForm';
// import MovieResults from './MovieResults';


function getAppState(){
  return{
    movies: AppStore.getMovieResults()
  }
}

class App extends React.Component{


  constructor(props){
    super(props);
    this.state = {
      movies: ''
    };

  }



  componentDidMount(){
    AppStore.addChangeListener(this._onChange.bind(this));

  }
  componentWillUnMount(){
    AppStore.removeChangeListener(this._onChange.bind(this));
  }

  render(){
      var movieResults =
      <div>{this.state.movies}</div>
    return(
      <div>
        {movieResults}
        <button onClick={AppActions.addMovies.bind(this)}>Add</button>
        <button onClick={AppActions.clearMovies.bind(this)}>Clear</button>        
      </div>
    )
  }


  _onChange(){
    this.setState(getAppState());

  }


}


export default App;
