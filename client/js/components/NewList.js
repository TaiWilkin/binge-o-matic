import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

export class NewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      error: ''
    }
    this.addList = this.addList.bind(this);
  }

  componentWillMount() {
    if (!this.props.loggedIn) {
      this.props.dispatch(actions.setPage('login'));
    }
  }

  onChange(e) {
    this.setState({ name: e.target.value, error: '' });
  }

  addList(e) {
    e.preventDefault();
    const { name } = this.state;
    if (name.includes('/')) {
      this.setState({ error: 'Invalid character: /', name: '' });
    } else if (this.props.lists.find(list => list.name === name)) {
      this.setState({ error: 'List already exists.', name: '' });
    } else {
      this.props.dispatch(actions.addList({ name }));
      this.setState({ name: '' });
    }
  }

  render() {
    return (
      <main>
        <div className="subheader">
          <h2>New List</h2>
          <button className="edit-btn" onClick={() => this.props.dispatch(actions.setPage('home'))}>
            CANCEL
          </button>
          <h3>Choose Title</h3>
          <h3 className="error">{this.state.error}</h3>
          <form className="search" onSubmit={e => this.addList(e)}>
            <input
              type="text"
              placeholder="Star Trek"
              value={this.state.name}
              required
              onChange={(e) => this.onChange(e)}
            />
            <button type="submit">CREATE</button>
          </form>
        </div>
      </main>
    );
  }
}

const mapStateToProps = ({ loggedIn, lists }) => ({
  loggedIn,
  lists
});

export default connect(mapStateToProps)(NewList);
