import React, { useState, useEffect, useRef } from 'react';
import { colorTheme } from '../components/ColorTheme';

const Contact = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    form: false,
    info: false,
    faq: false
  });
  
  const [activeTab, setActiveTab] = useState('message');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });
  
  const [activeFaq, setActiveFaq] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const observers = {};
    const sections = ['hero', 'form', 'info', 'faq'];
    
    sections.forEach(section => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [section]: true }));
          }
        },
        { threshold: 0.1 }
      );
      
      const element = document.getElementById(`contact-${section}`);
      if (element) {
        observer.observe(element);
        observers[section] = observer;
      }
    });
    
    return () => {
      sections.forEach(section => {
        const element = document.getElementById(`contact-${section}`);
        if (element && observers[section]) {
          observers[section].unobserve(element);
        }
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission
    setFormStatus({
      submitted: true,
      error: false,
      message: 'Thank you for your message! We will get back to you soon.'
    });
    
    // In a real implementation, you would send the form data to your backend
    console.log('Form data submitted:', formData);
    
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    // Add animation to scroll back to top of form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Office locations data
  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Get in touch via email",
      content: "support@medeasy.com",
      action: "Send Email",
      link: "mailto:support@medeasy.com"
    },
    {
      icon: "📞",
      title: "Call Us",
      description: "Speak directly to our team",
      content: "+1 (800) 555-1234",
      action: "Call Now",
      link: "tel:+18005551234"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team",
      content: "Available 24/7",
      action: "Start Chat",
      link: "#"
    }
  ];
  
  // FAQ data
  const faqItems = [
    {
      question: "How quickly can I expect a response?",
      answer: "We strive to respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line directly."
    },
    {
      question: "Can I schedule an appointment through contact form?",
      answer: "For appointment scheduling, we recommend using our dedicated booking system in the 'Book Appointment' section of our website or mobile app for faster processing."
    },
    {
      question: "How do I join MedEasy as a healthcare provider?",
      answer: "Healthcare providers interested in joining our network can select 'Doctor Application' in the subject dropdown of our contact form, or email us directly at providers@medeasy.com."
    },
    {
      question: "Is MedEasy available in my area?",
      answer: "MedEasy currently operates in most major metropolitan areas across the United States. Please provide your location details in your inquiry, and we'll let you know about availability in your area."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r ${colorTheme.primary.light} opacity-10 blur-3xl animate-pulse`} style={{animationDuration: '15s'}}></div>
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r ${colorTheme.secondary.light} opacity-10 blur-3xl animate-pulse`} style={{animationDuration: '20s', animationDelay: '2s'}}></div>
      </div>
      
      {/* Hero Section */}
      <section 
        id="contact-hero" 
        className="relative pt-28 pb-8 px-4 sm:px-6 lg:px-8"
      >
        <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${colorTheme.primary.gradient} text-white flex items-center justify-center shadow-lg`}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient} mb-4`}>
            Get In Touch
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help you with appointments, service inquiries, or any other questions.
          </p>
          
          {/* Bouncing Arrow */}
          <div className="mt-8 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>
      
      {/* Main Content Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left Side - Contact Info */}
              <div 
                id="contact-info" 
                className={`lg:col-span-2 transition-all duration-1000 transform ${isVisible.info ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              >
                <div className={`h-full bg-gradient-to-br ${colorTheme.primary.gradient} p-8 text-white`}>
                  <div className="h-full flex flex-col">
                    <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                    <p className="mb-8 opacity-80">
                      Choose the most convenient way to reach our support team. We're ready to assist you!
                    </p>
                    
                    <div className="space-y-8 flex-grow">
                      {contactMethods.map((method, index) => (
                        <div 
                          key={index} 
                          className="flex items-start transform transition-all duration-500 hover:translate-x-2"
                        >
                          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex-shrink-0 flex items-center justify-center backdrop-blur-sm text-xl">
                            {method.icon}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold">{method.title}</h3>
                            <p className="text-sm opacity-80 mb-1">{method.description}</p>
                            <p className="font-medium">{method.content}</p>
                            <a 
                              href={method.link} 
                              className="inline-flex mt-2 text-sm items-center bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm px-3 py-1 rounded-full transition-all duration-300"
                            >
                              {method.action} <span className="ml-1">→</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Social Media Links */}
                    <div className="mt-auto pt-10">
                      <p className="text-sm opacity-80 mb-3">Connect with us on social media</p>
                      <div className="flex space-x-4">
                        {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((platform) => (
                          <a 
                            key={platform} 
                            href="#" 
                            className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transform transition-all duration-300 hover:scale-110"
                            aria-label={platform}
                          >
                            {/* Simple text icon placeholder - replace with actual icons in real implementation */}
                            <span className="text-xs font-bold">{platform[0]}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Contact Form */}
              <div 
                id="contact-form" 
                ref={formRef}
                className={`lg:col-span-3 p-8 transition-all duration-1000 transform ${isVisible.form ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
              >
                {/* Tabs */}
                <div className="mb-8 flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('message')}
                    className={`pb-4 px-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                      activeTab === 'message' 
                        ? `border-emerald-500 text-emerald-600` 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => setActiveTab('appointment')}
                    className={`pb-4 px-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                      activeTab === 'appointment' 
                        ? `border-emerald-500 text-emerald-600` 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => setActiveTab('join')}
                    className={`pb-4 px-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                      activeTab === 'join' 
                        ? `border-emerald-500 text-emerald-600` 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Join as Doctor
                  </button>
                </div>
                
                {formStatus.submitted ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className={`w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4`}>
                      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 text-center max-w-md">{formStatus.message}</p>
                    <div className={`mt-6 relative group`}>
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorTheme.primary.gradient} rounded-full blur opacity-30 group-hover:opacity-70 transition duration-300`}></div>
                      <button 
                        onClick={() => setFormStatus(prev => ({ ...prev, submitted: false }))}
                        className="relative bg-white px-6 py-2 rounded-full text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-all duration-300"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {activeTab === 'message' && 'Send us a Message'}
                      {activeTab === 'appointment' && 'Request an Appointment'}
                      {activeTab === 'join' && 'Join Our Medical Network'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors duration-200">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div className="group">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors duration-200">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors duration-200">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            placeholder="(123) 456-7890"
                          />
                        </div>
                        
                        <div className="group">
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors duration-200">Subject</label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          >
                            <option value="">Select a topic</option>
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Appointment Help">Appointment Help</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Billing Question">Billing Question</option>
                            <option value="Doctor Application">Doctor Application</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="group">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors duration-200">Your Message</label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          placeholder="How can we help you today?"
                        ></textarea>
                      </div>
                      
                      <div>
                        <div className={`relative group`}>
                          <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorTheme.primary.gradient} rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300`}></div>
                          <button
                            type="submit"
                            className="relative w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
                          >
                            {activeTab === 'message' && 'Send Message'}
                            {activeTab === 'appointment' && 'Request Appointment'}
                            {activeTab === 'join' && 'Submit Application'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section 
        id="contact-faq"
        className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50"
      >
        <div className={`max-w-3xl mx-auto transition-all duration-1000 transform ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${colorTheme.secondary.gradient} text-white flex items-center justify-center shadow-lg mb-4`}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.secondary.gradient}`}>
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 ${
                  activeFaq === index ? 'ring-2 ring-amber-500' : 'hover:shadow-lg'
                }`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <svg 
                    className={`w-5 h-5 text-amber-500 transform transition-transform duration-300 ${
                      activeFaq === index ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    activeFaq === index ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r ${colorTheme.primary.gradient} text-white relative overflow-hidden`}>
        {/* Animated decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-10 animate-pulse" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-white rounded-full opacity-10 animate-pulse" style={{animationDuration: '5s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Better Healthcare?</h2>
          <p className="mb-8 text-white text-opacity-90 max-w-2xl mx-auto">
            Join thousands of patients who have transformed how they access medical care with MedEasy.
          </p>
          <div className="inline-block relative group">
            <div className="absolute -inset-0.5 bg-white rounded-full blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
            
            <a  href="#"
              className="relative inline-flex items-center px-8 py-3 bg-white text-emerald-600 font-medium rounded-full hover:text-emerald-700 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
            >
              Book Your First Appointment
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;