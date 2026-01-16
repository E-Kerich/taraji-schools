import { Users, Target, Heart, Globe, Award, Lightbulb, BookOpen, Shield, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  // Brand colors
  const colors = {
    red: '#e92327',
    yellow: '#fff200',
    dark: '#1a1a1a',
    light: '#f8f9fa'
  };

  // Mission statement
  const mission = {
    title: "Our Commitment to Excellence",
    description: "Brookside International School is a centre of excellence offering a globally recognised international curriculum grounded in strong values and holistic development. We are committed to nurturing confident, curious, and capable learners who are prepared to thrive in an ever-changing world.",
    features: [
      "Globally recognised Cambridge curriculum",
      "Values-based education system",
      "Holistic development approach",
      "Future-ready learning environment"
    ]
  };

  // Vision statement
  const vision = {
    title: "Our Vision",
    statement: "To be a regional model in providing holistic learning experiences that stimulate and inspire learners for future success.",
    aspects: [
      "Regional leadership in education",
      "Holistic learning experiences",
      "Inspirational learning environment",
      "Future-ready graduates"
    ]
  };

  // Core values
  const values = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Academic Excellence",
      description: "Rigorous Cambridge curriculum with high standards"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Character Formation",
      description: "Developing integrity, empathy, and resilience"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Citizenship",
      description: "Preparing students for worldwide opportunities"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Holistic Development",
      description: "Nurturing mind, body, and spirit"
    }
  ];


  return (
    <section className="relative py-5 lg:py-10 bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-full" />
        
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-8 rounded-full" style={{ backgroundColor: colors.red }} />
            <span 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: colors.red }}
            >
              About Our School
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Brookside International School
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A centre of excellence for holistic Cambridge Curriculum education
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Mission & Values */}
          <div className="space-y-10">
            {/* Mission Statement */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                
                <h3 className="text-2xl font-bold text-gray-900">{mission.title}</h3>
              </div>
              
              <p className="text-sm md:text-lg text-gray-700 leading-relaxed">
                {mission.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {mission.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <ArrowRight className="w-5 h-5 text-red-500 mt-1" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Vision */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                
                <h3 className="text-2xl font-bold text-gray-900">{vision.title}</h3>
              </div>
              
              <div className="relative p-2 rounded-xl" style={{ 
                backgroundColor: `${colors.yellow}05`,
                borderLeftColor: colors.yellow 
              }}>
                <p className="text-lg text-gray-800 italic leading-relaxed">
                  "{vision.statement}"
                </p>
              </div>
              
              
            </div>

           
          </div>

          {/* Right Column - Values & Highlights */}
          <div className="space-y-10">
            {/* Core Values */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div 
                  className="rounded-lg"
          
                >
        
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Core Values</h3>
              </div>
              
              <div className="grid gap-4">
                {values.map((value, index) => (
                  <div 
                    key={index}
                    className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 
                             transition-all duration-300 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-3 rounded-lg transition-all duration-300 group-hover:scale-110"
                        style={{ 
                          backgroundColor: `${colors.red}10`,
                          color: colors.red
                        }}
                      >
                        {value.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h4>
                        <p className="text-gray-600 text-sm">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
        {/* CTA Section */}
        <div className="mt-16 lg:mt-20 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Brookside Education
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Join our community of learners and discover how we prepare students for success in an interconnected world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: colors.red,
                  color: 'white'
                }}
              >
                Book a Campus Tour
              </button>
              <button 
                className="px-8 py-3 rounded-lg font-semibold text-lg border-2 transition-all duration-300 hover:shadow-lg"
                style={{ 
                  borderColor: colors.red,
                  color: colors.red
                }}
              >
                Meet Our Faculty
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;