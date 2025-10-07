import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  MapPin,
  Globe,
  Phone,
  Mail,
  Edit,
  Camera,
  ExternalLink,
  Calendar,
  Briefcase,
  Award,
  CheckCircle,
  Clock,
  Upload,
  Save,
  X,
  Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    industry: '',
    size: '',
    description: '',
    website: '',
    location: '',
    contactPerson: '',
    contactPhone: '',
    logo: '',
    verificationStatus: 'pending'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { user, token, loading: authLoading } = useAuth();

  // Company size options
  const companySizeOptions = [
    '1-10 employees',
    '11-50 employees',
    '51-100 employees',
    '101-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  // Industry options
  const industryOptions = [
    'Technology',
    'Software Development',
    'Finance',
    'Healthcare',
    'Education',
    'E-commerce',
    'Marketing',
    'Consulting',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Other'
  ];

  useEffect(() => {
    if (!authLoading && token) {
      fetchProfile();
    }
  }, [authLoading, token]);

  const fetchProfile = async () => {
    try {
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/companies/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        console.log('Company profile not found - user can create one');
      } else {
        console.error('Failed to fetch profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      if (!token) {
        alert('Please sign in to save your profile');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/companies/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Company profile updated successfully!');
        fetchProfile();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getVerificationBadge = () => {
    switch (profile.verificationStatus) {
      case 'verified':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Verified Company</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Verification Pending</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Not Verified</span>
          </div>
        );
    }
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading company profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saving Indicator */}
      {saving && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50">
          <Loader className="animate-spin mr-2" size={16} />
          Saving...
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-1">Manage your company information and settings</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={saveProfile} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Building2 className="mr-2" size={20} />
                Company Overview
              </h3>
              {getVerificationBadge()}
            </div>

            <div className="space-y-6">
              {/* Company Logo and Name */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    {profile.logo ? (
                      <img
                        src={profile.logo}
                        alt="Company Logo"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 className="text-white" size={32} />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <Input
                    label="Company Name"
                    value={profile.companyName || ''}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    disabled={!isEditing}
                    className="text-xl font-bold"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  {isEditing ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profile.industry || ''}
                      onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                    >
                      <option value="">Select Industry</option>
                      {industryOptions.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg">{profile.industry || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  {isEditing ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profile.size || ''}
                      onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                    >
                      <option value="">Select Size</option>
                      {companySizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      {profile.size || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>

              {/* Location and Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Location"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!isEditing}
                  placeholder="San Francisco, CA"
                />
                <Input
                  label="Website"
                  value={profile.website || ''}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  disabled={!isEditing}
                  placeholder="https://yourcompany.com"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={profile.description || ''}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    placeholder="Tell us about your company, what you do, and what makes you unique..."
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-lg">
                    {profile.description || 'No description provided'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Phone className="mr-2" size={20} />
              Contact Information
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Person"
                  value={profile.contactPerson || ''}
                  onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                  disabled={!isEditing}
                  placeholder="John Smith"
                />
                <Input
                  label="Contact Phone"
                  value={profile.contactPhone || ''}
                  onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+1-555-123-4567"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Primary Email</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">This is your account email and cannot be changed here</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Briefcase className="mr-2" size={20} />
              Company Activity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">124</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Hires Made</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Card */}
          <Card className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                {profile.logo ? (
                  <img
                    src={profile.logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="text-white" size={32} />
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{profile.companyName || 'Company Name'}</h4>
              <p className="text-gray-600">{profile.industry}</p>
              <p className="text-sm text-gray-500 flex items-center justify-center mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.location}
              </p>

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Visit Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </Card>

          {/* Verification Status */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Verification Status</h4>
            {getVerificationBadge()}
            
            {profile.verificationStatus === 'verified' ? (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Your company has been verified! This helps build trust with potential candidates.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700 mb-2">
                  Complete your profile to request verification:
                </p>
                <ul className="text-xs text-yellow-600 space-y-1">
                  <li>• Add company description</li>
                  <li>• Upload company logo</li>
                  <li>• Provide contact information</li>
                  <li>• Add website URL</li>
                </ul>
                <Button className="w-full mt-3" size="sm">
                  Request Verification
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase size={16} className="mr-2" />
                Post New Job
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users size={16} className="mr-2" />
                View Applications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload size={16} className="mr-2" />
                Upload Logo
              </Button>
            </div>
          </Card>

          {/* Profile Completion */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Profile Completion</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: '75%' }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Complete your profile to attract top talent
              </div>
            </div>
          </Card>

          {/* Last Updated */}
          {profile.updatedAt && (
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-2">Last Updated</h4>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
