import React from 'react';

class Dropdown extends React.Component{
	constructor(props){
		super(props);
	}
	_processList(){
		var optionList = this.props.list;
		var options = [];
		options = optionList.map(function(option,index){
			return (
					<option key={index} value={option}>{option}</option>
				)
		});
		return options;
	}
	render(){
		var options = this._processList();
		return(
			<div>
				<select className='col-lg-3 col-md-6 col-sm-12 text-center dropdown' 
				onChange={this.props.selectItem}>
					<option value='All'>All Matches</option>
					{options}
				</select>
			</div>
		);
	}
}
export default Dropdown;