import React, { useState } from 'react';
import { User, Briefcase, Building2, Search, LogOut, Award, TrendingUp, Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';

const Navigation = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'jobs', label: 'Find Jobs', icon: Search },
    { id: 'applications', label: 'My Applications', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'assessments', label: 'Skill Tests', icon: Award }
  ];

  const companyNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'candidates', label: 'Find Candidates', icon: Search },
    { id: 'applications', label: 'Applications', icon: User },
    { id: 'profile', label: 'Company Profile', icon: Building2 }
  ];

  const navItems = user?.role === 'student' ? studentNavItems : companyNavItems;

  return (
    <>
      {/* Mobile top navbar with hamburger */}
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:hidden">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            InternMatch
          </h1>
        </div>
        <button 
          onClick={toggleMobileMenu} 
          aria-label="Toggle menu" 
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white shadow-lg border-b border-gray-200 md:hidden z-40">
          <nav className="px-4 py-2 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCurrentView(item.id);
                  }}
                  className={`flex items-center w-full px-3 py-3 rounded-lg text-left transition-colors ${
                    item.id === currentView 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <Icon size={20} />
                  <span className="ml-3">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center w-full px-3 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut size={20} />
              <span className="ml-3">Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar - sticky positioned */}
      <aside className="hidden md:flex md:flex-col md:sticky md:top-0 md:h-screen md:w-64 md:bg-white md:shadow-lg md:border-r md:border-gray-200 md:z-40">
        <div className="p-6 flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InternMatch
            </h1>
            <p className="text-sm text-gray-500 mt-2">Welcome, {user?.name}</p>
          </div>
          
          <nav className="flex-grow">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    item.id === currentView 
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon size={20} />
                  <span className="ml-3 font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-gray-200">
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full flex items-center justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span className="ml-3">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
