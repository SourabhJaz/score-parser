import React from 'react';

class ScoreCard extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
      return (
        <div className = 'scores-wrap'>
          <div className = 'row scores'>
            <div className = 'col-lg-6 col-md-6 col-sm-6 col-xs-6'>
              <div className = 'team-name'>{this.props.team_1}</div>
              <div className = 'team-score'>{this.props.score_1}</div>
            </div>
            <div className = 'col-lg-6 col-md-6 col-sm-6 col-xs-6'>
              <div className = 'team-name'>{this.props.team_2}</div>
              <div className = 'team-score'>{this.props.score_2}</div>
            </div>
          </div>
          <div className = 'col-lg-12 text-center status'>
            {this.props.status}
          </div>
        </div>
      );
  }
}

export default ScoreCard;