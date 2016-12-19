import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions/cheese';

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.searchMovies = this.searchMovies.bind(this);
    }

    searchMovies() {
        const movieName = this.movieNameInput.value;
        console.log("now searching for", movieName);
    }

    render() {
        return (
            <div className="search">
                <input type="text" ref={ref => this.movieNameInput = ref} />
                <button type="button" onClick={this.searchMovies}>
                    Search
                </button>
            </div>
        );
    }
}


export default connect()(Search);