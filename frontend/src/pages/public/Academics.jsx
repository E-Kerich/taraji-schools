import React, { useEffect } from 'react'
import AcademicsHero from '../../components/academics/Hero'
import CurriculumFramework from '../../components/academics/Framework'
import KeyLearningAreas from '../../components/academics/Learning'



const Academics = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  return (
    <div>
      <AcademicsHero/>
      <CurriculumFramework/>
      <KeyLearningAreas/>

    </div>
  )
}

export default Academics
