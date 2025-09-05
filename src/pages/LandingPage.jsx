import React from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook,
  ArrowRight
} from 'lucide-react';

const LandingPage = ({ onShowLogin, onShowRegister }) => {
  // Sample data for company directors
  const companyDirectors = [
    {
      name: "Ayush Mahariya",
      position: "Co-founder & CTO",
      image: "/images/directors/ayush_photo.jpeg",
      bio: "IIT Kharagpur Grad",
      linkedin: "https://www.linkedin.com/in/ayush-mahariya-9402bb208/"
    },
    {
      name: "Aryan Chahil",
      position: "Co-founder & CEO", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      bio: "RGIPT Grad",
      linkedin: "https://www.linkedin.com/in/aryan-chahil-b382641b2/"
    }
  ];

  // Sample data for partner companies
  const partnerCompanies = [
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      jobsPosted: 45,
      category: "Technology"
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      jobsPosted: 38,
      category: "Technology"
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      jobsPosted: 52,
      category: "E-commerce"
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      jobsPosted: 29,
      category: "Social Media"
    },
    {
      name: "Tesla",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
      jobsPosted: 31,
      category: "Automotive"
    },
    {
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      jobsPosted: 22,
      category: "Entertainment"
    },
    {
      name: "Spotify",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
      jobsPosted: 18,
      category: "Music & Audio"
    },
    {
      name: "Airbnb",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
      jobsPosted: 25,
      category: "Travel & Hospitality"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        user={null} // No user on landing page
        logout={null}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Bridge the Gap Between <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Talent and Opportunity
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We handle the complete hiring process, skill development, and matching to connect 
            verified student talent with companies seeking quality interns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onShowRegister}>
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">2,500+</div>
              <div className="text-gray-600">Verified Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">150+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">92%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose InternMatch?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive platform that benefits both students and companies through our rigorous process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Rigorous Hiring Process',
                description: 'Comprehensive screening ensures only quality candidates reach companies.'
              },
              {
                icon: '📊',
                title: 'Dynamic Skill Profiles',
                description: 'Continuously updated profiles with real-time talent insights.'
              },
              {
                icon: '🎓',
                title: 'Continuous Learning',
                description: 'Integrated programs help students improve their competencies.'
              },
              {
                icon: '🤝',
                title: 'Perfect Matching',
                description: 'AI-powered system matches skills with company requirements.'
              },
              {
                icon: '⚡',
                title: 'Fast Placement',
                description: 'Pre-vetted candidates save company time and resources.'
              },
              {
                icon: '📈',
                title: 'Performance Tracking',
                description: 'Monitor progress with detailed analytics and feedback.'
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced leadership team brings together decades of expertise from top technology 
              and talent acquisition companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyDirectors.map((director, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="relative mb-6">
                  <img 
                    src={director.image} 
                    alt={director.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1 rounded-full">
                    <a href={director.linkedin} target='_blank'><Linkedin className="w-4 h-4 text-white" /></a>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{director.name}</h4>
                <p className="text-blue-600 font-medium mb-3">{director.position}</p>
                <p className="text-gray-600 text-sm">{director.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Partner Companies</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Leading companies trust InternMatch to find their next generation of talent. 
              Join hundreds of organizations already posting internships on our platform.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {partnerCompanies.map((company, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{company.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{company.category}</p>
                  <div className="flex items-center text-xs text-blue-600">
                    <span>{company.jobsPosted} active jobs</span>
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">Ready to join these industry leaders?</p>
            <Button size="lg" onClick={onShowRegister}>
              Post Your First Job - Free
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how InternMatch has transformed careers and helped companies find exceptional talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "InternMatch helped me land my dream internship at Google. The skill assessments really made my profile stand out!",
                author: "Alex Thompson",
                position: "Software Engineering Intern at Google",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
              },
              {
                quote: "We've hired 15 exceptional interns through InternMatch. The pre-screening process saves us countless hours.",
                author: "Maria Garcia",
                position: "HR Director at Microsoft", 
                avatar: "https://images.unsplash.com/photo-1494790108755-2616c2c9b6a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
              },
              {
                quote: "The platform's matching algorithm connected me with the perfect marketing internship. Couldn't be happier!",
                author: "David Kim",
                position: "Marketing Intern at Netflix",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
              }
            ].map((story, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{story.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={story.avatar} 
                    alt={story.author}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{story.author}</p>
                    <p className="text-sm text-gray-600">{story.position}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and hundreds of companies already using InternMatch 
            to build the future workforce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={onShowRegister}
              className="bg-white text-blue-600 hover:bg-gray-50"
            >
              Get Started as Student
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={onShowRegister}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Post Jobs as Company
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                InternMatch
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Bridging the gap between exceptional student talent and forward-thinking companies 
                through innovative matching technology and comprehensive skill development.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* For Students */}
            <div>
              <h4 className="text-white font-semibold mb-4">For Students</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find Internships</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Skill Assessments</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Student Success Stories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Builder</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Interview Prep</a></li>
              </ul>
            </div>

            {/* For Companies */}
            <div>
              <h4 className="text-white font-semibold mb-4">For Companies</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Post Internships</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find Candidates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing Plans</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hiring Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Company Directory</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Metrics</a></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support & Legal</h4>
              <ul className="space-y-3 mb-6">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">hello@internmatch.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="border-t border-gray-800 py-8">
            <div className="max-w-md">
              <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest internship opportunities and career tips delivered to your inbox.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <Button className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 InternMatch. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Accessibility
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
