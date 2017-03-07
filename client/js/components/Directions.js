import React from 'react';
import Steps from './Steps';

const Directions = () => {
  return (
    <div className="directions">
      <div className="info">
        <h3>What is the Binge-o-Matic?</h3>
        <p>This website will allow you to create watchlists for multiple movies and shows.</p>
        <p>If you have fallen behind in a <a href="https://cnet4.cbsistatic.com/hub/i/2016/09/30/08ac4c1c-79b5-4198-be2e-607344b95a24/finalmarvelgraphicv37.png">complex cinematic universe</a>,
        the Binge-o-Matic will help you catch up while still watching in release-date order,
        including in cases where two or more shows in the 'verse' were running concurrently.</p>
        <p>For example, someone thought it would be a good idea to set 'Thor: The Dark World'
        in the middle of 'SHIELD' season one. The Binge-o-Matic will tell you exactly which
        episodes of 'SHIELD' to watch before you see 'Thor'.</p>
      </div>
      <Steps />
    </div>);
  };

export default Directions;
