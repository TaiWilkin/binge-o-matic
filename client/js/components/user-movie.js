import React from 'react';

export default class UserMovie extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		console.log("Deleting", this.props.id)
	}

	render() {
		let img = `https://image.tmdb.org/t/p/w300${this.props.img}`;
		return (
		<li className="movie" id={this.props.id}>
			<h4>{this.props.title}</h4>
			<img src={img} />
			<p>{this.props.date}</p>
			<button onClick={this.onClick}>Delete</button>
		</li>
	);
	} 
}

