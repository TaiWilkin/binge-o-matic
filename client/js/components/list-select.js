import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions';

class ListSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {id: 1};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  	// this.props.dispatch(actions.getLists());
  }

  handleChange(event) {
    this.setState({id: event.target.value});
  }

  handleSubmit(event) {
  	event.preventDefault();
    console.log(this.state.id)
    this.props.dispatch(actions.setList(this.state.id));
  }

  render() {
  	const lists = [{name: "list1", id: 1}, {name: "list2", id: 2}, {name: "list3", id: 3}];
  	let options = lists.map(list => (<option key={list.id} value={list.id}>{list.name}</option>));
    return (
      <form className="getList" onSubmit={this.handleSubmit}>
        <label>
          Choose a List to View:
          <select className="listselectors" value={this.state.id} onChange={this.handleChange}>
            {options}
          </select>
        </label>
        <input className="submit" type="submit" value="Submit" />
      </form>
    );
  }
}

export default connect()(ListSelect);
