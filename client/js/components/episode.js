import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions';

export class Episode extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
    <li className="episode" id={this.props.id}>
      <p>{this.props.title} Episode {this.props.number}: {this.props.episode} ({this.props.release_date})</p>
    </li>
  );
  }
}


export default connect()(Episode);
