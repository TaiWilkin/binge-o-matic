import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';

import * as actions from '../actions';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const name = this.state.text;
    if (name.includes('/')) {
      this.setState({ error: 'Invalid character: /', name: '' });
    } else if (this.props.lists.find(list => list.name === name)) {
      this.setState({ error: 'List already exists.', name: '' });
    } else {
      const path = `/${this.props.list}`;
      this.props.dispatch(actions.editList(path, this.state.text));
      this.setState({ text: '' });
      this.props.dispatch(actions.setPage('home'));
    }
  }

  onDelete() {
    const path = `/${this.props.list}`;
    this.props.dispatch(actions.deleteList(path));
    this.props.dispatch(actions.setPage('about'));
  }

  renderButton() {
    if (this.state.loading) {
      return <div className="spinner" />;
    }
    return <button className="standalone-btn" type="submit">Login/Signup</button>;
  }

  render() {
    return (
      <main>
        <div className="subheader">
          <h2>Editing {this.props.listName}</h2>
          <button className="right" onClick={() => this.props.dispatch(actions.setPage('home'))}>
            RETURN TO LIST
          </button>
          <h3 className="simple-header">Change Title</h3>
        <form className="search" onSubmit={(e) => this.onSubmit(e)}>
          <input
            type="text"
            placeholder="Enter new title"
            value={this.state.text}
            onChange={(e) => this.onChange(e)}
          />
          <button type="submit">SUBMIT</button>
        </form>
        <h3 className="simple-header">Delete List</h3>
        <button className="standalone-btn" onClick={this.onDelete.bind(this)}>DELETE</button>
        </div>
      </main>
    );
  }
}

const mapStateToProps = ({ listName, list }) => {
  return { listName, list };
};

export default connect(mapStateToProps)(Edit);
