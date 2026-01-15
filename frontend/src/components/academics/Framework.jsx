import { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  Lightbulb, 
  GraduationCap,
  ChevronRight,
  Globe,
  Users,
  Sparkles,
  CheckCircle
} from 'lucide-react';

// Import your images here or use placeholder/unsplash
// For now, I'll use Unsplash educational images
const curriculumPoints = [
    {
      id: 1,
      icon: BookOpen,
      title: "Strong Subject Foundations",
      description: "We build comprehensive knowledge and skills in core subjects through systematic progression and mastery-based learning.",
      longDescription: "Our structured approach ensures students develop deep understanding in English, Mathematics, Sciences, and Humanities. Each concept is carefully scaffolded to build upon previous knowledge, creating a solid academic base for future learning.",
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-red-100"
    },
    {
      id: 2,
      icon: Target,
      title: "Analytical & Problem-Solving Skills",
      description: "Students learn to think critically, analyze information, and solve complex problems across all disciplines.",
      longDescription: "Through inquiry-based learning and real-world challenges, we cultivate analytical thinking. Students engage in Socratic discussions, case studies, and project-based learning to develop logical reasoning and innovative problem-solving abilities.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-red-100"
    },
    {
      id: 3,
      icon: Lightbulb,
      title: "Curiosity & Independent Learning",
      description: "We foster intellectual curiosity and self-directed learning skills that prepare students for lifelong education.",
      longDescription: "Our learning environment encourages questioning, exploration, and discovery. Students learn to set personal learning goals, conduct research, and take ownership of their educational journey through guided independence.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-red-100"
    },
    {
      id: 4,
      icon: GraduationCap,
      title: "Examination & Higher Education Preparation",
      description: "Comprehensive preparation for international qualifications and smooth transition to global universities.",
      longDescription: "We provide structured pathways for Cambridge IGCSE, A-Levels, and other international qualifications. Our university counseling program ensures students are well-prepared for competitive admissions worldwide.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-red-100"
    }
  ];

const CurriculumFramework = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);

  return (
    <div className="relative py-5 md:py-10 lg:py-15 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-6">
            
            <span className="text-sm font-medium text-red-700">Curriculum Framework</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            Our Curriculum Framework
          </h2>
          
        

          {/* Key Points */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Globe className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Global Recognition</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Users className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Student-Centred</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <CheckCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Progressive Structure</span>
            </div>
          </div>
        </div>

        {/* Curriculum Points Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {curriculumPoints.map((point, index) => (
            <div
              key={point.id}
              className={`relative group cursor-pointer transition-all duration-500 ${
                expandedCard === point.id ? 'lg:col-span-2' : ''
              }`}
              onClick={() => setExpandedCard(expandedCard === point.id ? null : point.id)}
              onMouseEnter={() => setActiveCard(index)}
            >
              {/* Main Card */}
              <div className={`relative overflow-hidden rounded-2xl border-2 ${
                point.borderColor
              } bg-white shadow-lg hover:shadow-2xl transition-all duration-500 ${
                expandedCard === point.id ? 'shadow-2xl scale-[1.02]' : 'hover:scale-[1.02]'
              }`}>
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className={`relative h-48 md:h-auto md:w-5/12 overflow-hidden ${
                    expandedCard === point.id ? 'md:h-64' : 'md:h-56'
                  }`}>
                    <img
                      src={point.image}
                      alt={point.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      point.color
                    } opacity-20`}></div>
                    
                    {/* Icon Badge */}
                    
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        {point.title}
                      </h3>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        expandedCard === point.id ? 'rotate-90' : ''
                      }`} />
                    </div>

                    <p className="text-gray-600 mb-4">
                      {expandedCard === point.id ? point.longDescription : point.description}
                    </p>

                    {/* Expanded Content */}
                    {expandedCard === point.id && (
                      <div className="mt-6 space-y-4 animate-in slide-in-from-top">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-500">Key Focus</div>
                            <div className="font-medium text-gray-900">Mastery Learning</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-500">Assessment</div>
                            <div className="font-medium text-gray-900">Continuous & Formative</div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <button className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                            Learn more about this approach
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    
                  </div>
                </div>
              </div>

              {/* Connection Line (for visual flow) */}
              {index < curriculumPoints.length - 1 && !expandedCard && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        

      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-12 space-x-2">
        {curriculumPoints.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeCard === index 
                ? 'w-8 bg-gradient-to-r from-red-600 to-red-500' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to curriculum point ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CurriculumFramework;