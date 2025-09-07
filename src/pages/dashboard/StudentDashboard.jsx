import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  Award, 
  User, 
  GraduationCap, 
  Search, 
  Edit, 
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Calendar,
  FileText,
  Target,
  Star,
  ChevronRight,
  Plus,
  Eye,
  Download,
  BookOpen,
  Users,
  MapPin,
  DollarSign,
  Building2,
  Filter,
  SortDesc,
  ExternalLink,
  Mail,
  Phone,
  Github,
  Linkedin
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const StudentDashboard = ({ currentView, setCurrentView }) => {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch all data in parallel
      const [profileRes, analyticsRes, applicationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/students/profile`, { headers }),
        fetch(`${API_BASE_URL}/api/analytics/dashboard`, { headers }),
        fetch(`${API_BASE_URL}/api/applications/student`, { headers })
      ]);

      // Handle profile response (might be 404 if no profile exists yet)
      let profileData = null;
      if (profileRes.ok) {
        profileData = await profileRes.json();
      } else if (profileRes.status === 404) {
        // Profile doesn't exist yet - this is okay for new users
        profileData = null;
      } else {
        console.error('Profile fetch failed:', profileRes.status);
      }

      // Handle analytics response
      let analyticsData = null;
      if (analyticsRes.ok) {
        analyticsData = await analyticsRes.json();
      } else {
        console.error('Analytics fetch failed:', analyticsRes.status);
      }

      // Handle applications response
      let applicationsData = [];
      if (applicationsRes.ok) {
        applicationsData = await applicationsRes.json();
      } else {
        console.error('Applications fetch failed:', applicationsRes.status);
      }

      setProfile(profileData);
      setAnalytics(analyticsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navbar */}
      {/* <nav className="bg-white shadow-lg border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16"> */}
            {/* Logo and Welcome */}
            {/* <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InternMatch
              </h1>
              <div className="hidden md:block text-sm text-gray-500">
                Welcome back, {user?.name}!
              </div>
            </div> */}

            {/* Navigation Links */}
            {/* <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-sm" onClick={() => setCurrentView('jobs')}>
                <Search className="w-4 h-4 mr-2" />
                Find Jobs
              </Button>
              <Button variant="ghost" className="text-sm" onClick={() => setCurrentView('applications')}>
                <Briefcase className="w-4 h-4 mr-2" />
                Applications
              </Button>
              <Button variant="ghost" className="text-sm" onClick={() => setCurrentView('assessments')}>
                <Award className="w-4 h-4 mr-2" />
                Assessments
              </Button>
              <Button variant="ghost" className="text-sm" onClick={() => setCurrentView('profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div> */}

            {/* Right Side - Profile & Logout */}
            {/* <div className="flex items-center space-x-4"> */}
              {/* User Profile */}
              {/* <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div> */}

              {/* Logout Button */}
              {/* <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Track your internship journey and discover new opportunities</p>
        </div>

        {/* Profile Setup Alert */}
        {!profile && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  Complete your profile to get personalized job recommendations and increase your visibility to employers.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <Button size="sm" onClick={() => setCurrentView("profile")}>Complete Profile</Button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Stats Grid */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalApplications}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="text-blue-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.activeApplications}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.shortlistedApplications}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="text-green-600" size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Profile Completion</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.profileCompletion}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <User className="text-purple-600" size={24} />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Experience */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Overview */}
            {profile && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Overview</h3>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentView('profile')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">University</p>
                    <p className="text-gray-900">{profile.university}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Major</p>
                    <p className="text-gray-900">{profile.major}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                    <p className="text-gray-900">{profile.graduationYear}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">GPA</p>
                    <p className="text-gray-900">{profile.gpa}</p>
                  </div>
                </div>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex space-x-4">
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900">
                      <Github className="w-4 h-4 mr-1" />
                      GitHub
                    </a>
                  )}
                  {profile.linkedIn && (
                    <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900">
                      <Linkedin className="w-4 h-4 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  {profile.portfolio && (
                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Portfolio
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Projects */}
            {profile && profile.projects && profile.projects.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentView('profile')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
                <div className="space-y-6">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(project.completedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map(tech => (
                            <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Project
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Skill Assessments */}
            {profile && profile.skillAssessments && profile.skillAssessments.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Skill Assessments</h3>
                  <Button variant="ghost" size="sm">
                    <Award className="w-4 h-4 mr-2" />
                    Take More
                  </Button>
                </div>
                <div className="space-y-4">
                  {profile.skillAssessments.map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{assessment.skill}</h4>
                        <p className="text-sm text-gray-600">
                          Score: {assessment.score}/{assessment.maxScore} • {assessment.level}
                        </p>
                        <p className="text-xs text-gray-500">
                          Completed {new Date(assessment.completedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Award className={`w-6 h-6 ${
                          assessment.level === 'Advanced' ? 'text-green-500' :
                          assessment.level === 'Intermediate' ? 'text-yellow-500' : 'text-gray-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Applications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                <Button variant="ghost" size="sm" onClick={() => setCurrentView('applications')}>
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{application.jobId?.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Building2 className="w-3 h-3 mr-1" />
                            {application.companyId?.companyName}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                        {application.interviewDate && (
                          <p className="text-xs text-green-600 mt-1">
                            Interview scheduled: {new Date(application.interviewDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No applications yet</p>
                  <Button className="mt-4" onClick={() => setCurrentView('jobs')}>
                    <Search className="w-4 h-4 mr-2" />
                    Find Jobs to Apply
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('jobs')}>
                  <Search className="mr-3" size={16} />
                  Browse Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('assessments')}>
                  <Award className="mr-3" size={16} />
                  Take Assessment
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('profile')}>
                  <Edit className="mr-3" size={16} />
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('profile')}>
                  <FileText className="mr-3" size={16} />
                  Upload Resume
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('profile')}>
                  <Plus className="mr-3" size={16} />
                  Add Project
                </Button>
              </div>
            </Card>

            {/* Profile Completion */}
            {analytics && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Strength</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span className="font-medium">{analytics.profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${analytics.profileCompletion}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Basic information added</span>
                      </div>
                      {analytics.skillsCount > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{analytics.skillsCount} skills added</span>
                        </div>
                      )}
                      {analytics.assessmentsPassed > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{analytics.assessmentsPassed} assessments completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-sm" onClick={() => setCurrentView('profile')}>
                    <Target className="w-4 h-4 mr-2" />
                    Improve Profile
                  </Button>
                </div>
              </Card>
            )}

            {/* Additional Stats */}
            {analytics && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{analytics.assessmentsPassed}</p>
                  <p className="text-xs text-gray-500">Tests Passed</p>
                </Card>
                <Card className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.averageAssessmentScore ? Math.round(analytics.averageAssessmentScore) : 0}%
                  </p>
                  <p className="text-xs text-gray-500">Avg Score</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
