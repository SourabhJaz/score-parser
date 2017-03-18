import React from 'react';
import AppActions from '../actions/AppActions';
import AppStore from '../stores/AppStore';
import ScoreCard from './scorecard';
import Dropdown from './Dropdown';

function getAppState(){
  return{
    data : AppStore.getMatches(),
    categories : [],
    selected: 'All'
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
  _getCategories(){
    var currentMatches = this.state.data || {};
    var matchList = currentMatches.matches || [];
    var categories = [];
    var uniqueCategories;
    categories = matchList.map(function(match,index){
      return match.category;
    });
    uniqueCategories = new Set(categories);
    return Array.from(uniqueCategories);
  }
  _selectCategory(event){
    this.setState({selected:event.target.value});
  }
  _onChange(){
    this.setState(getAppState());
  }
  _filterMatch(match){
      if(this.state.selected === 'All' || match.category === this.state.selected){
        return true;
      }
      return false;
  }
  _parseMatches(){
    var currentMatches = this.state.data || {};
    var matchList = currentMatches.matches || [];
    var scoreCards = [];
    var notStarted, printCategory;
    var currentCategory = '';
    scoreCards = matchList.filter(this._filterMatch.bind(this)).map(function(match,index){
      notStarted = false;
      printCategory = false;
      if(!match.score_1){
        notStarted = true;
      }
      if(match.category !== currentCategory)
      {
        currentCategory = match.category;
        printCategory = true;
      }
      return (
        <div>
          {printCategory && (<div className='col-lg-12 col-md-12 col-sm-12 text-center category'>{currentCategory}</div>)}
          <div className = 'col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xm-12' key = {index}>
            <div className = {'scorecard '+(notStarted?'not-started':'')}>
              <ScoreCard data={match} />
            </div>
          </div>
        </div>
      )
    });
    return scoreCards;
  }
  render(){
    var matchCards = this._parseMatches();
    var categoryList = this._getCategories();
    var noData = (<h2>Fetching live scores ...</h2>);
    return( 
      <div>
      <Dropdown list={categoryList} selectItem={this._selectCategory.bind(this)} />
      {this.state.data ? matchCards : noData}
      </div>
    )
  }
}


export default App;
