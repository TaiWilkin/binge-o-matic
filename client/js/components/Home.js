import React from 'react';
import { connect } from 'react-redux';

class Home extends React.PureComponent {
  render() {
    if (this.props.userMovies.length === 0) {
      return <SearchMovies />;
    }
    return <UserList />;
  }

}

const mapStateToProps = ({ userLists, list, page, userMovies }) => {
  return { userLists, list, page, userMovies };
};

export default connect(mapStateToProps)(Home);
