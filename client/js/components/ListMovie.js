import React from 'react';
import { connect } from 'react-redux';

const ListMovie = (props) => {
    let title = props.title;
    let img = (<img src={`https://image.tmdb.org/t/p/w92${props.poster_path}`} alt='poster' />);
    if (!props.poster_path) {
      img = '';
    }
    if (props.media_type === 'season') {
      title = `${props.title}: Season ${props.number}`;
    }
    if (props.media_type === 'episode') {
      title = `${props.title}: Episode ${props.number}: ${props.episode}`;
    }

    return (
      <li id={props.id}><div>
        {img}
        <p>{title} ({props.release_date})</p>
      </div></li>
  );
};

export default ListMovie;
