import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: 1 };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(actions.getLists());
  }

  handleChange(id) {
    this.setState({ id });
    return Promise.resolve(this.props.dispatch(actions.setList(id)))
    .then(() => this.props.dispatch(actions.fetchMovies(id)))
    .catch(error => console.log(error));
  }

  render() {
    const options = this.props.lists.map(list =>
      (<a onClick={(e) => { e.preventDefault(); this.handleChange(list.id); } } key={list.id} value={list.id}>{list.name}</a>));
    return (
      <nav>
        <ul className="nav">
          <li className="dropdown">
              <a className="dropbtn">Watchlists</a>
              <div className="dropdown-content">
                {options}
              </div>
          </li>
          <li><a>New List</a></li>
          <li className="right"><a>Login</a></li>
        </ul>
      </nav>
    );
  }
}

  const mapStateToProps = (state, props) => ({
    userMovies: state.userMovies,
    list: state.list,
    lists: state.lists
  });

export default connect(mapStateToProps)(Nav);
