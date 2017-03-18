import React from 'react';
import AppActions from '../actions/AppActions';
import AppStore from '../stores/AppStore';
import ScoreCard from './scorecard';


function getAppState(){
  return{
    data : AppStore.getMatches()
  }
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = getAppState();
  }
  componentWillMount(){
    AppStore.addChangeListener(this._onChange.bind(this));    
  }
  componentDidMount(){
    AppStore.addChangeListener(this._onChange.bind(this));
    AppActions.initialData();
    AppActions.matchCall();
  }
  componentWillUnMount(){
    AppStore.removeChangeListener(this._onChange.bind(this));
  }
  _onChange(){
    this.setState(getAppState());
  }
  _parseMatches(){
    var currentMatches = this.state.data || {};
    console.log(currentMatches);
    var matchList = currentMatches.matches || [];
    var scoreCards = [];
    var notStarted;
    scoreCards = matchList.map(function(match,index){
      notStarted = false;
      if(!match.score_1){
        notStarted = true;
      }
      return (
          <div className = 'col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xm-12' key = {index}>
            <div className = {'scorecard '+(notStarted?'not-started':'')}>
              <ScoreCard data={match} />
            </div>
          </div>
      )
    });
    return scoreCards;
  }
  render(){
    var matchCards = this._parseMatches();
    var noData = (<h2>Fetching live scores ...</h2>);
    return( 
      <div>
      {this.state.data ? matchCards : noData}
      </div>
    )
  }
}


export default App;
