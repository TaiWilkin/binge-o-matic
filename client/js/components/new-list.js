import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions';

export class NewList extends React.Component {
  constructor(props) {
    super(props);
    this.addList = this.addList.bind(this);
  }

  addList(e) {
    e.preventDefault();
    const listName = this.listNameInput.value;
    console.log(listName);
    this.props.dispatch(actions.addList({name: listName}));
    setTimeout(() => this.listNameInput.value = "", 750);
    console.log("now adding list", listName);
  }

  render() {
    return (
      <form className="listmaker" onSubmit={this.addList}>
      	<label>
        Create a New List:
        <input className="listbar" type="text" ref={ref => this.listNameInput = ref} />
        </label>
        <button className="submit" type="button" onClick={this.addList}>
          Create List
        </button>
      </form>
    );
  }
}


export default connect()(NewList);