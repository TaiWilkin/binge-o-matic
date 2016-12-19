import React from 'react';

export default class SearchMovie extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		console.log(`Adding ${this.props.id} to UserList and deleting ${this.props.id} from SearchList}`)
	}

	render() {
		return (
		<li className="movie" id={this.props.id}>
			<h4>{this.props.title}</h4>
			<img src={this.props.img} />
			<p>{this.props.date}</p>
			<button onClick={this.onClick}>Add</button>
		</li>
	);
	} 
}

