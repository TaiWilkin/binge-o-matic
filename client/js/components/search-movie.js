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
		let img = `https://image.tmdb.org/t/p/w300${this.props.img}`;
		if (this.props.img === null) {
			img = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Clapboard.svg/1000px-Clapboard.svg.png";
		}
		return (
		<li className="movie" id={this.props.id}>
			<h4>{this.props.title}</h4>
			<img src={img} />
			<p>{this.props.date}</p>
			<button onClick={this.onClick}>Add</button>
		</li>
	);
	} 
}

