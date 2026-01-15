import { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  Globe, 
  Users, 
  Target, 
  Sparkles,
  ChevronRight,
  PlayCircle,
  GraduationCap
} from 'lucide-react';

const AcademicsHero = () => {
  const [activeStat, setActiveStat] = useState(0);

  // Rotate through stats for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

 

  const academicHighlights = [
    {
      icon: BookOpen,
      title: "British International Curriculum",
      description: "Aligned with Cambridge and Pearson Edexcel standards"
    },
    {
      icon: Target,
      title: "Personalised Learning Pathways",
      description: "Individual support to maximise each learner's potential"
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "International mindedness woven throughout our curriculum"
    },
    {
      icon: Sparkles,
      title: "Holistic Development",
      description: "Academic excellence balanced with character education"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            

            {/* Main Heading */}
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
              Academics at{' '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-600">
                Brookside
              </span>
              <br />
              International School
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              Academic Excellence with Purpose
            </p>

            {/* Description */}
            <div className="space-y-4 text-gray-700">
              <p className="text-sm md:text-lg leading-relaxed">
                At Brookside International School, our academic programme is designed to challenge, 
                inspire, and prepare learners for global success. We deliver a rigorous British 
                international education while nurturing character, confidence, and independent thinking.
              </p>
              <p className="text-l leading-relaxed">
                Our approach balances strong academic foundations with creativity, inquiry, and 
                real-world relevance, ensuring learners don't just memorise content, but understand, 
                apply, and excel.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group inline-flex text-sm items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <span className="text-lg font-medium">Download Our Curriculum</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group inline-flex items-center text-sm justify-center gap-2 px-6 py-3.5 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow">
                <PlayCircle className="w-5 h-5 text-red-600" />
                <span className="text-lg font-medium">Watch Our Story</span>
              </button>
            </div>
          </div>

          {/* Right Column - Stats & Highlights */}
          <div className="space-y-8">
            

            {/* Highlights Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Academic Approach
              </h3>
              
              <div className="space-y-6">
                {academicHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 group cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300">
                        <highlight.icon className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                        {highlight.title}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <a href="#" className="text-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-light">
                    View Syllabus
                  </a>
                  <a href="#" className="text-center px-4 py-3 bg-clear text-gray-700 rounded-lg border text-sm border-gray-700 font-light">
                    Visit Our School
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      
    </div>
  );
};

export default AcademicsHero;