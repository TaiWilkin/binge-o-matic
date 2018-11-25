import React from 'react';
import QueryHandler from './QueryHandler';
import { withRouter } from 'react-router-dom';
import query from '../queries/Nav';
import AuthButton from './AuthButton';
import NavLists from './NavLists';

class Nav extends React.Component {
  render() {
    return (
      <QueryHandler query={query} pollInterval={500}>
        {({ data, client, loading }) => {
          return (
            <nav>
              <ul className="nav">
                <li><button onClick={() => this.props.history.push('/about')}>About</button></li>
                <NavLists lists={data.lists} title="Watch-Order Lists" />
                {!!data.user && <NavLists lists={data.user.lists} title="My Lists" />}
                <li><button onClick={() => this.props.history.push('/newlist')}>New List</button></li>
                <AuthButton user={data.user} client={client} loading={loading} />
              </ul>
            </nav>
          );
        }}
      </QueryHandler>
    );
  }
}

export default withRouter(Nav);
