import React, { useState, useEffect } from 'react';
import { Building2, MapPin, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    type: ''
  });
  const [loading, setLoading] = useState(true);

  const { user, token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      fetchJobs();
    }
  }, [filters, authLoading]);

  const fetchJobs = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const response = await fetch(`${API_BASE_URL}/api/jobs?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
      } else {
        console.error('Failed to fetch jobs:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId) => {
    try {
      if (!token) {
        alert('Please sign in to apply for jobs');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId, coverLetter: '' })
      });

      if (response.ok) {
        alert('Application submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Error submitting application');
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
        <div className="text-lg text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'student' ? 'Find Internships' : 'My Job Postings'}
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'student' ? 'Discover amazing internship opportunities' : 'Manage your job postings'}
        </p>
      </div>

      {user?.role === 'student' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Filter Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Skills"
              placeholder="e.g., React, Python, Marketing"
              value={filters.skills}
              onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
            />
            <Input
              label="Location"
              placeholder="e.g., New York, Remote"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
            <Select
              label="Job Type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              options={[
                { value: '', label: 'All Types' },
                { value: 'full-time', label: 'Full Time' },
                { value: 'part-time', label: 'Part Time' },
                { value: 'remote', label: 'Remote' }
              ]}
            />
          </div>
        </Card>
      )}

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </Card>
        ) : (
          jobs.map(job => (
            <Card key={job._id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.type === 'remote' ? 'bg-green-100 text-green-800' :
                      job.type === 'full-time' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {job.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building2 size={16} className="mr-1" />
                      {job.companyId?.companyName}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <IndianRupee size={16} className="mr-1" />
                      {job.stipend}/month
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills?.slice(0, 5).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {user?.role === 'student' && (
                  <div className="ml-4">
                    <Button onClick={() => applyToJob(job._id)}>
                      Apply Now
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JobListings;
