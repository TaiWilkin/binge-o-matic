import React from 'react';

const About = () => {
  return (
    <main>
      <div className="subheader">
       <h2>About</h2>
     </div>
      <div className="about">
      <p>One of the most amazing things about the second Captain America movie was how it fit into Agents of SHIELD. If you watched the episode of Agents of SHIELD that aired the week before the movie first aired. then watched the movie on opening night, and then watched that week’s Agents of SHIELD, it gives you <span>an incredible extra layer of context.</span></p>

      <p>TV shows and movies that are interconnected are nothing new, especially in the comic-book and SciFi ‘verses. But when you try to go back and watch something in the perfect order, you end up spending hours on Wikipedia trying to correlate air-dates of individual episodes of various shows. <span>The Binge-o-Matic will produce that perfect watching order for you in minutes.</span></p>

      <p>Need all the spinoffs of Stargate? Buffy and Angel, perfectly interspliced? Is Dance Moms your guilty pleasure? Don’t get halfway through and be surprised when JoJo shows up — meet her in ‘Abby’s Ultimate Dance Competition’ at the right time.</p>

      <p>Go now! <button id="create-btn">Create a list!</button> The future of television beckons you.</p>
      </div>
    </main>
  );
};

export default About;
