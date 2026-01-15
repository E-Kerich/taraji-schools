import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, ArrowRight, Globe, Building, Award } from 'lucide-react';

const CampusesSection = () => {
  // Brand colors
  const colors = {
    red: '#e92327',
    yellow: '#fff200',
    dark: '#1a1a1a',
    light: '#f8f9fa'
  };

  // Campus data with your specific details
  const campuses = [
    {
      id: 1,
      name: "Westlands Campus",
      location: "Westlands, Nairobi",
      description: "A dynamic, modern campus offering Cambridge curriculum in a prime urban setting with extensive co-curricular programs.",
      image: "/assets/westlands-campus.jpg",
      features: [
        "Montessori Kindergarten (0-6 years)",
        "Primary - Year 1 to Year 6",
        "Secondary - Year 7 to Year 13",
        "Science & Technology Labs",
        "Sports Complex",
        "Performing Arts Center"
      ],
      programs: ["Cambridge", "IGCSE", "A-Levels"],
      studentCount: "Comprehensive K-13",
      established: "Urban Environment",
      ctaText: "Visit Westlands Campus",
      ctaLink: "/campus/westlands"
    },
    {
      id: 2,
      name: "Redhill Campus",
      location: "Redhill, Nairobi",
      description: "A serene campus specializing in early years and primary education, offering Cambridge curriculum in a peaceful setting.",
      image: "/assets/redhill-campus.jpg",
      features: [
        "Montessori Kindergarten (0-6 years)",
        "Primary - Year 1 to Year 2",
        "Early Years Focus",
        "Outdoor Learning Areas",
        "Creative Arts Studio",
        "Peaceful Environment"
      ],
      programs: ["Cambridge", "EYFS", "Foundation Stage"],
      studentCount: "Early Years Focus",
      established: "Serene Environment",
      ctaText: "Visit Redhill Campus",
      ctaLink: "/campus/redhill"
    }
  ];

  return (
    <section className="py-5 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: colors.red }} />
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.red }}>
              Our Campuses
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-light text-gray-700 mb-4">
            Vibrant <span style={{ color: colors.red }}>Learning</span> Environments
          </h2>
          <p className="text-sm md:text-lg text-gray-600">
            Each Brookside campus offers a unique environment with shared commitment to excellence, 
            values, and Cambridge global education.
          </p>
        </div>

        {/* Campus Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {campuses.map((campus) => (
            <div
              key={campus.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                       transition-all duration-500 hover:-translate-y-2"
            >
              {/* Campus Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={campus.image}
                  alt={`${campus.name} - ${campus.location}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{ 
                    background: `linear-gradient(45deg, ${colors.red}20, ${colors.yellow}20)`
                  }}
                />
                {/* Campus Badge */}
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                    <Building className="w-4 h-4" style={{ color: colors.red }} />
                    <span className="text-sm font-semibold" style={{ color: colors.red }}>
                      {campus.id === 1 ? "Full Cambridge" : "Early Years Focus"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campus Content */}
              <div className="p-8">
                {/* Campus Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {campus.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{campus.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                        <Award className="w-4 h-4" style={{ color: colors.red }} />
                        <span className="text-sm font-medium">Cambridge</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {campus.description}
                  </p>
                </div>

                {/* Features - Now shows classes */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" style={{ color: colors.red }} />
                    Classes Offered
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {campus.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.red }} />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats & Programs */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: colors.red }} />
                    <span className="text-sm font-medium">{campus.studentCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: colors.red }} />
                    <span className="text-sm font-medium">{campus.established}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-auto">
                    {campus.programs.map((program, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={campus.ctaLink}
                  className="group/btn inline-flex items-center justify-center gap-3 w-full 
                           px-6 py-3 rounded-lg font-semibold transition-all duration-300 
                           hover:shadow-lg hover:-translate-y-0.5"
                  style={{ 
                    backgroundColor: colors.red,
                    color: 'white'
                  }}
                >
                  <span>{campus.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default CampusesSection;