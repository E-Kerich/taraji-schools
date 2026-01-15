import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Users, Globe, Target, Heart, Sparkles } from 'lucide-react';

const AboutHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Brand colors
  const colors = {
    red: '#e92327',
    yellow: '#fff200',
    dark: '#1a1a1a',
    light: '#f8f9fa'
  };

  // Content data
  const content = {
    title: "About Brookside International School",
    subtitle: "Who We Are",
    images: [
      "/assets/9.jpg",
      "/assets/5.jpg",
      "/assets/8.jpg",
      "/assets/7.jpg",
      "/assets/11.jpg"
    ],
    shortDescription: "Brookside International School is a values-driven institution offering a globally recognised British international education within a nurturing and inclusive environment.",
    fullDescription: `We exist to develop confident, curious, and principled learners who are prepared to succeed academically, socially, and morally in a globalised world.

We believe education should not only prepare learners for exams, but for life. That belief shapes everything we do, from our curriculum and teaching methods to our culture, community, and care for every child.`,
    ourMission: "To inspire greatness and godliness in our learners.",
    ourVision: "To be a regional model in providing holistic learning experiences that stimulate and inspire learners for future success.",
   
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [content.images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % content.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + content.images.length) % content.images.length);
  };

  return (
    <section className="py-10 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: colors.red }} />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.red }}>
                  {content.subtitle}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {content.title}
              </h2>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-4">
                <p className="text-lg text-gray-600">
                  {content.shortDescription}
                </p>
                
                <p className="text-l text-gray-600 te">
                    {content.fullDescription}
                </p>
              </div>
              
              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    
                    <h4 className="font-bold text-gray-900">Our Mission</h4>
                  </div>
                  <p className="text-gray-600">{content.ourMission}</p>
                </div>
                
                <div className="p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    
                    <h4 className="font-bold text-gray-900">Our Vision</h4>
                  </div>
                  <p className="text-gray-600">{content.ourVision}</p>
                </div>
              </div>
              
              
            </div>
          </div>

          {/* Right Column - Image Slider */}
          <div className="relative">
            {/* Image Slider Container */}
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative">
              {content.images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Brookside International School - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{ 
                      background: `linear-gradient(45deg, ${colors.red}20, ${colors.yellow}20)`
                    }}
                  />
                </div>
              ))}
              
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 
                         backdrop-blur-sm flex items-center justify-center hover:bg-white 
                         transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 
                         backdrop-blur-sm flex items-center justify-center hover:bg-white 
                         transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {content.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-6 bg-white' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
              
              {/* Slide Counter */}
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 rounded-full backdrop-blur-sm bg-black/40">
                  <span className="text-white text-sm font-medium">
                    {currentSlide + 1} / {content.images.length}
                  </span>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Join Our <span style={{ color: colors.red }}>Global Learning</span> Community
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Discover how Brookside International School can help your child thrive academically, 
              socially, and morally in today's globalised world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg 
                         font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: colors.red,
                  color: 'white'
                }}
              >
                <span>Schedule a Visit</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg 
                         font-semibold border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ 
                  borderColor: colors.red,
                  color: colors.red
                }}
              >
                <span>Download Prospectus</span>
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;