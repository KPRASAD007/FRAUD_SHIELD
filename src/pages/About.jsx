import React from 'react';

function About() {
  return (
    <div className="content">
      <h2>About FRAUD_SHIELD</h2>
      <p>Learn more about our mission to combat transaction fraud with innovative technology.</p>

      <section className="section">
        <h3>Our Mission</h3>
        <p>
          At FRAUD_SHIELD, we’re dedicated to protecting businesses and individuals from the growing threat of transaction fraud. Our goal is to provide cutting-edge tools that ensure secure, trustworthy financial interactions in an increasingly digital world.
        </p>
      </section>

      <section className="section">
        <h3>Our Technology</h3>
        <p>
          We harness the power of artificial intelligence and machine learning to detect and prevent fraud in real-time. Our systems analyze vast amounts of transaction data, adapting to new threats and delivering unparalleled accuracy.
        </p>
      </section>

      <section className="section">
        <h3>Our Team</h3>
        <p>
          Founded by experts in cybersecurity and data science, our team brings decades of experience to the fight against fraud. We’re passionate about innovation and committed to your security.
        </p>
      </section>
    </div>
  );
}

export default About;