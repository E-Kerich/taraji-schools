import { useState } from 'react';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical,
  Globe,
  Cpu,
  Palette,
  Dumbbell,
  Brain,
  Sparkles,
  ChevronRight,
  Target,
  Users,
  Lightbulb,
  Award
} from 'lucide-react';

const KeyLearningAreas = () => {
    const benefits = [
        {
          icon: Brain,
          title: 'Intellectual Development',
          description: 'Critical thinking and problem-solving abilities'
        },
        {
          icon: Users,
          title: 'Social Skills',
          description: 'Collaboration, communication, and empathy'
        },
        {
          icon: Lightbulb,
          title: 'Creativity',
          description: 'Innovative thinking and self-expression'
        },
        {
          icon: Award,
          title: 'Confidence',
          description: 'Self-assurance and leadership qualities'
        }
      ];
  

  return (
    <div className="relative py-5 md:py-10  bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      
        

        {/* Holistic Development Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                We Develop Balanced Learners
              </h3>
              <p className="text-sm md:text-lg text-gray-300 max-w-3xl mx-auto">
                Our curriculum integrates core and complementary subjects to develop capable, confident, 
                and well-rounded individuals prepared for success in all aspects of life.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 mb-4">
                      <benefit.icon className="w-8 h-8 text-red-400" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                    <p className="text-gray-300 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Integration Statement */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-xl italic text-gray-300">
                "These subjects work together to develop balanced, capable, and confident learners."
              </p>
            </div>
          </div>

          
        </div>
    
    </div>
  );
};

export default KeyLearningAreas;