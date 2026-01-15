import React from 'react'
import { useEffect } from 'react'
import HeroSection from '../../components/ui/Hero'
import AboutSection from '../../components/ui/About';
import CampusesSection from '../../components/ui/Campuses';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <div>
      <HeroSection/>
      <AboutSection/>
      <CampusesSection/>
    </div>
  )
}

export default Home
