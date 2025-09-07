import React, { useState, useEffect } from 'react';
import { Menu, X, User, Briefcase } from 'lucide-react';
import Button from '../ui/Button';

const Header = ({ onShowLogin, onShowRegister, user, logout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debug function to see what's happening
  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // console.log('Toggle clicked, current state:', isMenuOpen);
    setIsMenuOpen(prevState => {
      // console.log('Setting state from', prevState, 'to', !prevState);
      return !prevState;
    });
  };

  // Close menu
  const closeMenu = () => {
    // console.log('Closing menu');
    setIsMenuOpen(false);
  };

  // Debug when state changes
  useEffect(() => {
    // console.log('Menu state changed to:', isMenuOpen);
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest('.mobile-menu') &&
        !event.target.closest('.hamburger-btn')
      ) {
        console.log('Clicking outside, closing menu');
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#companies', label: 'Companies' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InternMatch
            </h1>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" onClick={logout} size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={onShowLogin}>
                  Sign In
                </Button>
                <Button onClick={onShowRegister}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="hamburger-btn md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            type="button"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu - ALWAYS RENDER but conditionally show */}
        <div className={`md:hidden mobile-menu ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Mobile Auth Section */}
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{user.name}</p>
                      <p className="text-gray-500 text-sm capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="px-4 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={closeMenu}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      onShowLogin();
                      closeMenu();
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      onShowRegister();
                      closeMenu();
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
