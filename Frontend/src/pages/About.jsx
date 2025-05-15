// About.jsx
import React, { useState, useEffect } from 'react';
import { colorTheme } from '../components/ColorTheme';
import {assets} from '../assets/assets';

function About() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    mission: false,
    stats: false,
    team: false,
    timeline: false,
    testimonials: false
  });

  useEffect(() => {
    const observers = {};
    const sections = ['hero', 'mission', 'stats', 'team', 'timeline', 'testimonials'];
    
    sections.forEach(section => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [section]: true }));
          }
        },
        { threshold: 0.1 }
      );
      
      const element = document.getElementById(`about-${section}`);
      if (element) {
        observer.observe(element);
        observers[section] = observer;
      }
    });
    
    return () => {
      sections.forEach(section => {
        const element = document.getElementById(`about-${section}`);
        if (element && observers[section]) {
          observers[section].unobserve(element);
        }
      });
    };
  }, []);

  // Team members data
  const teamMembers = [
    {
      name: "Eng. Rama Qattam",
      role: "Founder & Chief Executive Officer (CEO)",
      image: assets.ceo,
      bio: "Software engineer with a passion for digital health innovation. Founded MedEasy to transform healthcare access through modern technology and user-centered design"
    },
    {
      name: "Omar Shaher",
      role: "Chief Technology Officer (CTO)",
      image: assets.cto,
      bio: "Experienced software architect specializing in healthcare systems. Leads the technical development of MedEasy’s secure and user-friendly platform"
    },
    {
      name: "Dr. Rama Al-Salhi",
      role: "Medical Director",
      image: assets.medical_director,
      bio: "Family medicine specialist dedicated to improving patient care and education. Oversees clinical quality and healthcare partnerships at MedEasy."
    },
    {
      name: "Hasan Shaher",
      role: "Head of Operations",
      image: assets.operations,
      bio: "Healthcare operations expert focused on optimizing patient journeys and clinic workflows. Ensures smooth service delivery across the MedEasy network."
    }
  ];

  // Company stats
  const stats = [
    { value: "20+", label: "Doctors", icon: "👨‍⚕️" },
    { value: "3k+", label: "Patients", icon: "👨‍👩‍👧‍👦" },
    { value: "10+", label: "Specialties", icon: "🏥" },
    { value: "4.9", label: "Rating", icon: "⭐" }
  ];

  // Timeline events
  const timelineEvents = [
    { year: "2025", title: "Founded", description: "MedEasy was founded to revolutionize access to healthcare through smart, user-friendly technology" },
    { year: "2025 (Mid-Year)", title: " Initial Launch", description: "Launched the first version of the MedEasy platform, offering appointment booking across core medical specialties" },
    { year: "2026", title: "Early Growth", description: "Expanded services to include pharmacy orders, laboratory test bookings, and integrated health profiles for patients." },
    { year: "2026 (End of Year)", title: "Mobile App Launch", description: "Released the MedEasy mobile app on iOS and Android, enabling healthcare access anywhere, anytime" },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section 
        id="about-hero" 
        className="relative overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-100"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-20 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r ${colorTheme.primary.light} opacity-20 blur-3xl`}></div>
          <div className={`absolute -bottom-40 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r ${colorTheme.secondary.light} opacity-20 blur-3xl`}></div>
        </div>
        
        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 transform ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient}`}>
              About MedEasy
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Transforming healthcare through technology, making quality medical care accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section 
        id="about-mission" 
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${isVisible.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="relative mb-10 lg:mb-0">
              <div className={`absolute -inset-2 bg-gradient-to-r ${colorTheme.primary.gradient} rounded-lg opacity-10 blur-lg`}></div>
              <div className="relative">
                <img 
                  src="/src/assets/header_img.png" 
                  alt="Medical professionals collaborating" 
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br ${colorTheme.secondary.gradient} rounded-lg opacity-80 -z-10`}></div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  At MedEasy, we're on a mission to revolutionize healthcare delivery through innovative technology. 
                  We believe that quality healthcare should be accessible to everyone, regardless of location or circumstance.
                </p>
                <p>
                  Our platform connects patients with certified medical professionals, streamlining the appointment booking process 
                  and eliminating unnecessary barriers to care.
                </p>
                <div className="flex items-start space-x-3 pt-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${colorTheme.primary.gradient} flex-shrink-0 flex items-center justify-center text-white`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">Trusted Healthcare</h3>
                    <p className="text-gray-600">All doctors on our platform are verified and credentialed, ensuring the highest standards of care.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${colorTheme.secondary.gradient} flex-shrink-0 flex items-center justify-center text-white`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">Efficient Care</h3>
                    <p className="text-gray-600">Our streamlined booking process saves time for both patients and healthcare providers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section 
        id="about-stats"
        className={`py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${colorTheme.primary.gradient}`}
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">MedEasy by the Numbers</h2>
            <p className="mt-4 text-white text-opacity-80">Our growing impact on healthcare delivery</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-2 text-white">{stat.icon}</div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white text-opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section 
        id="about-team"
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${isVisible.team ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.secondary.gradient}`}>Our Leadership Team</h2>
            <p className="mt-4 text-gray-600">Meet the experts behind MedEasy's innovation</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60`}></div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                  <p className={`text-sm font-medium ${colorTheme.primary.text} mb-3`}>{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Timeline Section */}
      <section 
        id="about-timeline"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100"
      >
        <div className={`max-w-4xl mx-auto transition-all duration-1000 transform ${isVisible.timeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient}`}>Our Journey</h2>
            <p className="mt-4 text-gray-600">The story of MedEasy's beginning and vision for the future</p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%] h-full w-0.5 bg-gradient-to-b from-emerald-400 to-teal-500"></div>
            
            {/* Timeline events */}
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index}
                  className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="md:w-1/2 pb-8">
                    <div 
                      className={`md:${index % 2 === 0 ? 'ml-12' : 'mr-12'} bg-white p-5 rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]`}
                    >
                      <div className={`text-lg font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.secondary.gradient}`}>
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">{event.year}</div>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-[-8px] md:left-1/2 transform md:translate-x-[-50%] w-4 h-4 rounded-full bg-white border-4 border-emerald-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
          {/* Testimonials Section */}
<section 
  id="about-testimonials"
  className="py-16 px-4 sm:px-6 lg:px-8"
>
  <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
    <div className="text-center mb-12">
      <h2 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient}`}>What People Say</h2>
      <p className="mt-4 text-gray-600">Testimonials from patients and healthcare providers</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          quote: "MedEasy revolutionized my practice, allowing me to connect with patients more efficiently while reducing administrative overhead.",
          author: "Dr. Robert Chen",
          role: "Neurologist"
        },
        {
          quote: "As a busy parent, being able to book appointments instantly for my children has been lifesaving. The interface is intuitive and doctor selection is excellent.",
          author: "Maria Garcia",
          role: "Parent of 3"
        },
        {
          quote: "The platform's specialized care options helped me find the perfect specialist for my condition when local options were limited.",
          author: "James Wilson",
          role: "Patient"
        },
      ].map((testimonial, index) => (
        <div 
          key={index}
          className={`bg-white p-6 rounded-lg shadow-md border-t-4 border-${index % 2 === 0 ? 'emerald' : 'amber'}-500 hover:shadow-lg transition-all duration-300`}
        >
          <div className="mb-4">
            <h4 className="font-medium text-gray-900">{testimonial.author}</h4>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
          <div className="relative">
            <svg className="absolute -top-3 -left-3 w-8 h-8 text-gray-200 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="relative text-gray-600">{testimonial.quote}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000`}>
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Better Healthcare?</h2>
          <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of patients who have transformed how they access medical care with MedEasy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#" 
              className={`inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${colorTheme.primary.gradient} text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              Book an Appointment
            </a>
            <a 
              href="#" 
              className={`inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105`}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;