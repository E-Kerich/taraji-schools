import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Award, Users, Globe, ChevronRight, Star, BookOpen, Target, GraduationCap, MapPin, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Brand colors
  const colors = {
    red: '#e92327',
    yellow: '#fff200',
    dark: '#1a1a1a',
    light: '#f8f9fa'
  };

  // Content data
  const content = {
    mainImage: "/assets/8.jpg",
    sideImage: "/assets/students-classroom.jpg",
    // Cloudinary video URL - replace with your actual video URL
    backgroundVideo: "https://res.cloudinary.com/djgbv2hy7/video/upload/v1768381526/WhatsApp_Video_2026-01-14_at_12.04.27_PM_r6uoby.mp4",
    title: "Inspiring Greatness, Shaping Global Citizens",
    subtitle: "Cambridge Curriculum",
    description: "A premier Cambridge Curriculum school nurturing confident learners through academic excellence, character development, and holistic growth.",
    ctaPrimary: "View Our Campus",
    ctaSecondary: "Inquire Now"
  };

  const features = [
    { icon: <Award className="w-5 h-5" />, title: "Cambridge Curriculum", desc: "IGCSE & A-Levels" },
    { icon: <Users className="w-5 h-5" />, title: "Expert Faculty", desc: "UK-trained teachers" },
    { icon: <Globe className="w-5 h-5" />, title: "Global Community", desc: "40+ nationalities" },
    { icon: <BookOpen className="w-5 h-5" />, title: "Holistic Development", desc: "Arts & Sports" }
  ];

  // Optional: Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.log("Autoplay prevented:", e);
        // Fallback: user interaction required for autoplay
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Video Background with Light Overlay */}
      <div className="absolute inset-0">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => setIsVideoLoaded(true)}
          style={{ opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 1s ease-in' }}
        >
          <source src={content.backgroundVideo} type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img 
            src={content.mainImage} 
            alt="School background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>
        
        {/* Light gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(248, 249, 250, 0.85))`
          }}
        />
        
        {/* Optional: Subtle brand color accents in gradient */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(45deg, ${colors.red}10, transparent 50%, ${colors.yellow}10)`
          }}
        />
      </div>

      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full" />
        <div 
          className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ 
            background: `radial-gradient(circle, ${colors.red} 0%, transparent 70%)`
          }}
          />
      </div>

      {/* Main grid layout */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Text Content */}
          <div className="space-y-8 lg:space-y-10">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: colors.red }} />
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.red }}>
                {content.subtitle}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                <span>Inspiring</span>
                <span  style={{ color: colors.red }}> Greatness,</span> <br />
                <span className='text-gray-700'>Shaping Global Citizens</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-xl">
                {content.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 
                           transition-all duration-300 hover:shadow-md cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className={`p-2 rounded-lg transition-all duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}
                      style={{ 
                        backgroundColor: hoveredCard === index ? colors.red : `${colors.red}10`,
                        color: hoveredCard === index ? 'white' : colors.red
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/visit"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold 
                         text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 min-w-[200px]"
                style={{ 
                  backgroundColor: colors.red,
                  color: 'white'
                }}
              >
                <span>{content.ctaPrimary}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/curriculum"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold 
                         text-lg border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 min-w-[200px]"
                style={{ 
                  borderColor: colors.red,
                  color: colors.red
                }}
              >
                <span>{content.ctaSecondary}</span>
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            
          </div>

          {/* Right Column - Images */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/4] relative">
                <img
                  src={content.mainImage}
                  alt="Brookside International School Campus"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{ 
                    background: `linear-gradient(45deg, ${colors.red}20, ${colors.yellow}20)`
                  }}
                />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    
                    <div>
                      <h4 className="text-white font-bold">Excellence in Education</h4>
                      <p className="text-sm text-gray-200">Join our community of learners.</p>
                      
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div 
                className="absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-10"
                style={{ backgroundColor: colors.red }}
              />
              <div 
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10"
                style={{ backgroundColor: colors.yellow }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;