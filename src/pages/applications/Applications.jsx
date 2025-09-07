import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, Calendar } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = user?.role === 'student' ? `${API_BASE_URL}/api/applications/student` : `${API_BASE_URL}/api/applications/company`;
      
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'student' ? 'My Applications' : 'Job Applications'}
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'student' 
            ? 'Track the status of your internship applications'
            : 'Review applications from candidates'
          }
        </p>
      </div>

      <div className="grid gap-6">
        {applications.length === 0 ? (
          <Card className="p-8 text-center">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">
              {user?.role === 'student' 
                ? "You haven't applied to any positions yet."
                : "No applications received yet."
              }
            </p>
            {user?.role === 'student' && (
              <Button className="mt-4">Find Opportunities</Button>
            )}
          </Card>
        ) : (
          applications.map(application => (
            <Card key={application._id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user?.role === 'student' 
                        ? application.jobId?.title 
                        : application.studentId?.userId?.name
                      }
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building2 size={16} className="mr-1" />
                      {user?.role === 'student' 
                        ? application.companyId?.companyName
                        : application.jobId?.title
                      }
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>

                  {user?.role === 'student' ? (
                    <p className="text-gray-700 mb-2">
                      {application.jobId?.description?.substring(0, 150)}...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">University:</span> {application.studentId?.university}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Major:</span> {application.studentId?.major}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {application.studentId?.skills?.slice(0, 5).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  {user?.role === 'company' && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      {application.status === 'applied' && (
                        <Button size="sm">
                          Shortlist
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;
