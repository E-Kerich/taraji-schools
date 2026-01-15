import React, { useEffect } from 'react'
import AboutHero from '../../components/about/AboutHero'

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div>
      <AboutHero/>
    </div>
  )
}

export default About
