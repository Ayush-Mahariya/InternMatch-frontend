import React, { useState, useEffect } from 'react';
import {
  Edit,
  Award,
  User,
  Upload,
  Plus,
  BookOpen,
  Github,
  Linkedin,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  TrendingUp,
  X,
  Save,
  IndianRupee
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const StudentProfile = ({ currentView, setCurrentView }) => {
  const [profile, setProfile] = useState({
    university: '',
    major: '',
    graduationYear: '',
    gpa: '',
    skills: [],
    projects: [],
    certifications: [],
    experience: [],
    linkedIn: '',
    github: '',
    portfolio: '',
    preferences: {
      jobTypes: [],
      locations: [],
      industries: [],
      salaryExpectation: ''
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit states for different sections
  const [editingProject, setEditingProject] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingPreferences, setEditingPreferences] = useState(false);

  // Temporary states for forms
  const [tempProject, setTempProject] = useState({
    title: '',
    description: '',
    technologies: [],
    link: '',
    completedDate: ''
  });

  const [tempCertification, setTempCertification] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    credentialId: ''
  });

  const [tempExperience, setTempExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [tempPreferences, setTempPreferences] = useState({
    jobTypes: [],
    locations: [],
    industries: [],
    salaryExpectation: ''
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setProfile(data);
        setTempPreferences(data.preferences || { jobTypes: [], locations: [], industries: [], salaryExpectation: '' });
      } else if (response.status === 404) {
        console.log('Profile not found - user can create one');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      console.log("After adding project", profile);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
        fetchProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  // Skills handlers
  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Project handlers
  const startAddProject = () => {
    setTempProject({
      title: '',
      description: '',
      technologies: [],
      link: '',
      completedDate: new Date().toISOString().split('T')[0]
    });
    setEditingProject(-1); // -1 for new project
  };

  const startEditProject = (index) => {
    setTempProject({
      ...profile.projects[index],
      completedDate: profile.projects[index].completedDate 
        ? new Date(profile.projects[index].completedDate).toISOString().split('T')[0] 
        : ''
    });
    setEditingProject(index);
  };

  const saveProject = async () => {
    const projectToSave = {
      ...tempProject,
      completedDate: tempProject.completedDate ? new Date(tempProject.completedDate).toISOString() : new Date().toISOString()
    };

    let newProjects = [...profile.projects];
    // console.log("editingProject:", editingProject);
    if (editingProject === -1) {
      newProjects.push(projectToSave);
    } else {
      newProjects[editingProject] = projectToSave;
    }
    // console.log("Projects after adding new: ", newProjects)
    setProfile({ ...profile, projects: newProjects });
    // console.log("Profile after adding new: ", profile.projects);
    setEditingProject(null);
    // updateProfile();
  };

  const removeProject = (index) => {
    const newProjects = profile.projects.filter((_, i) => i !== index);
    setProfile({ ...profile, projects: newProjects });
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !tempProject.technologies.includes(newTechnology.trim())) {
      setTempProject({
        ...tempProject,
        technologies: [...tempProject.technologies, newTechnology.trim()]
      });
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech) => {
    setTempProject({
      ...tempProject,
      technologies: tempProject.technologies.filter(t => t !== tech)
    });
  };

  // Certification handlers
  const startAddCertification = () => {
    setTempCertification({
      name: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      credentialId: ''
    });
    setEditingCertification(-1);
  };

  const startEditCertification = (index) => {
    setTempCertification({
      ...profile.certifications[index],
      issueDate: profile.certifications[index].issueDate 
        ? new Date(profile.certifications[index].issueDate).toISOString().split('T')[0] 
        : ''
    });
    setEditingCertification(index);
  };

  const saveCertification = () => {
    const certToSave = {
      ...tempCertification,
      issueDate: tempCertification.issueDate ? new Date(tempCertification.issueDate).toISOString() : new Date().toISOString()
    };

    let newCertifications = [...profile.certifications];
    if (editingCertification === -1) {
      newCertifications.push(certToSave);
    } else {
      newCertifications[editingCertification] = certToSave;
    }

    setProfile({ ...profile, certifications: newCertifications });
    setEditingCertification(null);
  };

  const removeCertification = (index) => {
    const newCertifications = profile.certifications.filter((_, i) => i !== index);
    setProfile({ ...profile, certifications: newCertifications });
  };

  // Experience handlers
  const startAddExperience = () => {
    setTempExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setEditingExperience(-1);
  };

  const startEditExperience = (index) => {
    setTempExperience({
      ...profile.experience[index],
      startDate: profile.experience[index].startDate 
        ? new Date(profile.experience[index].startDate).toISOString().split('T')[0] 
        : '',
      endDate: profile.experience[index].endDate 
        ? new Date(profile.experience[index].endDate).toISOString().split('T')[0] 
        : ''
    });
    setEditingExperience(index);
  };

  const saveExperience = () => {
    const expToSave = {
      ...tempExperience,
      startDate: tempExperience.startDate ? new Date(tempExperience.startDate).toISOString() : '',
      endDate: tempExperience.endDate ? new Date(tempExperience.endDate).toISOString() : ''
    };

    let newExperience = [...profile.experience];
    if (editingExperience === -1) {
      newExperience.push(expToSave);
    } else {
      newExperience[editingExperience] = expToSave;
    }

    setProfile({ ...profile, experience: newExperience });
    setEditingExperience(null);
  };

  const removeExperience = (index) => {
    const newExperience = profile.experience.filter((_, i) => i !== index);
    setProfile({ ...profile, experience: newExperience });
  };

  // Preferences handlers
  const startEditPreferences = () => {
    setTempPreferences(profile.preferences || { jobTypes: [], locations: [], industries: [], salaryExpectation: '' });
    setEditingPreferences(true);
  };

  const savePreferences = () => {
    setProfile({ ...profile, preferences: tempPreferences });
    setEditingPreferences(false);
  };

  const addJobType = () => {
    if (newJobType.trim() && !tempPreferences.jobTypes.includes(newJobType.trim())) {
      setTempPreferences({
        ...tempPreferences,
        jobTypes: [...tempPreferences.jobTypes, newJobType.trim()]
      });
      setNewJobType('');
    }
  };

  const removeJobType = (type) => {
    setTempPreferences({
      ...tempPreferences,
      jobTypes: tempPreferences.jobTypes.filter(t => t !== type)
    });
  };

  const addLocation = () => {
    if (newLocation.trim() && !tempPreferences.locations.includes(newLocation.trim())) {
      setTempPreferences({
        ...tempPreferences,
        locations: [...tempPreferences.locations, newLocation.trim()]
      });
      setNewLocation('');
    }
  };

  const removeLocation = (location) => {
    setTempPreferences({
      ...tempPreferences,
      locations: tempPreferences.locations.filter(l => l !== location)
    });
  };

  const addIndustry = () => {
    if (newIndustry.trim() && !tempPreferences.industries.includes(newIndustry.trim())) {
      setTempPreferences({
        ...tempPreferences,
        industries: [...tempPreferences.industries, newIndustry.trim()]
      });
      setNewIndustry('');
    }
  };

  const removeIndustry = (industry) => {
    setTempPreferences({
      ...tempPreferences,
      industries: tempPreferences.industries.filter(i => i !== industry)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your professional information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={updateProfile}>
                Save Changes
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
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <GraduationCap className="mr-2" size={20} />
              Basic Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="University/College"
                  value={profile.university || ''}
                  onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Major/Field of Study"
                  value={profile.major || ''}
                  onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Expected Graduation Year"
                  type="number"
                  value={profile.graduationYear || ''}
                  onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="GPA"
                  type="number"
                  step="0.01"
                  max="10.0"
                  value={profile.gpa || ''}
                  onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ExternalLink className="mr-2" size={20} />
              Social Links & Portfolio
            </h3>
            <div className="space-y-4">
              <Input
                label="GitHub Profile"
                value={profile.github || ''}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                disabled={!isEditing}
                placeholder="https://github.com/yourusername"
              />
              <Input
                label="LinkedIn Profile"
                value={profile.linkedIn || ''}
                onChange={(e) => setProfile({ ...profile, linkedIn: e.target.value })}
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/yourprofile"
              />
              <Input
                label="Portfolio Website"
                value={profile.portfolio || ''}
                onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                disabled={!isEditing}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skills</h3>
            {isEditing && (
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add a new skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill}>Add</Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </Card>

          {/* Projects */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <BookOpen className="mr-2" size={20} />
                Projects
              </h3>
              {isEditing && (
              <Button variant="ghost" size="sm" onClick={startAddProject}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
              )}
            </div>

            {/* Project Edit Form */}
            {editingProject !== null && (
              <Card className="p-4 mb-4 border-2 border-blue-200">
                <h4 className="font-medium mb-4">{editingProject === -1 ? 'Add New Project' : 'Edit Project'}</h4>
                <div className="space-y-4">
                  <Input
                    label="Project Title"
                    value={tempProject.title}
                    onChange={(e) => setTempProject({ ...tempProject, title: e.target.value })}
                    placeholder="My Awesome Project"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      value={tempProject.description}
                      onChange={(e) => setTempProject({ ...tempProject, description: e.target.value })}
                      placeholder="Describe your project..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Add technology"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                      />
                      <Button onClick={addTechnology} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tempProject.technologies.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center">
                          {tech}
                          <button onClick={() => removeTechnology(tech)} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <Input
                    label="Project Link (optional)"
                    value={tempProject.link}
                    onChange={(e) => setTempProject({ ...tempProject, link: e.target.value })}
                    placeholder="https://github.com/yourproject"
                  />
                  <Input
                    label="Completion Date"
                    type="date"
                    value={tempProject.completedDate}
                    onChange={(e) => setTempProject({ ...tempProject, completedDate: e.target.value })}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={saveProject}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Project
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProject(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Projects List */}
            {profile.projects?.length > 0 ? (
              <div className="space-y-4">
                {profile.projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(project.completedDate).toLocaleDateString()}
                        </span>
                        {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => startEditProject(index)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        )}
                        {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => removeProject(index)} className="text-red-600">
                          <X className="w-3 h-3" />
                        </Button>
                        )}
                      </div>
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
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No projects added yet</p>
                {isEditing && (
                <Button className="mt-4" variant="outline" onClick={startAddProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Project
                </Button>
                )}
              </div>
            )}
          </Card>

          {/* Certifications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Award className="mr-2" size={20} />
                Certifications
              </h3>
              {isEditing && (
              <Button variant="ghost" size="sm" onClick={startAddCertification}>
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
              )}
            </div>

            {/* Certification Edit Form */}
            {editingCertification !== null && (
              <Card className="p-4 mb-4 border-2 border-green-200">
                <h4 className="font-medium mb-4">{editingCertification === -1 ? 'Add New Certification' : 'Edit Certification'}</h4>
                <div className="space-y-4">
                  <Input
                    label="Certification Name"
                    value={tempCertification.name}
                    onChange={(e) => setTempCertification({ ...tempCertification, name: e.target.value })}
                    placeholder="AWS Cloud Practitioner"
                  />
                  <Input
                    label="Issuing Organization"
                    value={tempCertification.issuer}
                    onChange={(e) => setTempCertification({ ...tempCertification, issuer: e.target.value })}
                    placeholder="Amazon Web Services"
                  />
                  <Input
                    label="Issue Date"
                    type="date"
                    value={tempCertification.issueDate}
                    onChange={(e) => setTempCertification({ ...tempCertification, issueDate: e.target.value })}
                  />
                  <Input
                    label="Credential ID (optional)"
                    value={tempCertification.credentialId}
                    onChange={(e) => setTempCertification({ ...tempCertification, credentialId: e.target.value })}
                    placeholder="AWS-CP-2024-001"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={saveCertification}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Certification
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCertification(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Certifications List */}
            {profile.certifications?.length > 0 ? (
              <div className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{cert.name}</h4>
                      <div className="flex items-center space-x-2">
                        {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => startEditCertification(index)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        )}
                        {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => removeCertification(index)} className="text-red-600">
                          <X className="w-3 h-3" />
                        </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">Issuer: {cert.issuer}</p>
                    <p className="text-gray-500 text-xs flex items-center mt-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    {cert.credentialId && (
                      <p className="text-gray-500 text-xs mt-1">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No certifications added yet</p>
                {isEditing && (
                <Button className="mt-4" variant="outline" onClick={startAddCertification}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
                )}
              </div>
            )}
          </Card>

          {/* Experience */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Briefcase className="mr-2" size={20} />
                Experience
              </h3>
              {isEditing && (
              <Button variant="ghost" size="sm" onClick={startAddExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
              )}
            </div>

            {/* Experience Edit Form */}
            {editingExperience !== null && (
              <Card className="p-4 mb-4 border-2 border-purple-200">
                <h4 className="font-medium mb-4">{editingExperience === -1 ? 'Add New Experience' : 'Edit Experience'}</h4>
                <div className="space-y-4">
                  <Input
                    label="Position/Job Title"
                    value={tempExperience.position}
                    onChange={(e) => setTempExperience({ ...tempExperience, position: e.target.value })}
                    placeholder="Software Engineering Intern"
                  />
                  <Input
                    label="Company Name"
                    value={tempExperience.company}
                    onChange={(e) => setTempExperience({ ...tempExperience, company: e.target.value })}
                    placeholder="TechCorp Inc."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      value={tempExperience.startDate}
                      onChange={(e) => setTempExperience({ ...tempExperience, startDate: e.target.value })}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={tempExperience.endDate}
                      onChange={(e) => setTempExperience({ ...tempExperience, endDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      value={tempExperience.description}
                      onChange={(e) => setTempExperience({ ...tempExperience, description: e.target.value })}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={saveExperience}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Experience
                    </Button>
                    <Button variant="outline" onClick={() => setEditingExperience(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Experience List */}
            {profile.experience?.length > 0 ? (
              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{exp.position}</h4>
                      <div className="flex items-center space-x-2">
                        {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => startEditExperience(index)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        )}
                        {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(index)} className="text-red-600">
                          <X className="w-3 h-3" />
                        </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{exp.company}</p>
                    <p className="text-gray-500 text-xs flex items-center mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No experience added yet</p>
                {isEditing && (
                <Button className="mt-4" variant="outline" onClick={startAddExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
                )}
              </div>
            )}
          </Card>

          {/* Job Preferences */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Job Preferences
              </h3>
              {isEditing && (
              <Button variant="ghost" size="sm" onClick={startEditPreferences}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Preferences
              </Button>
              )}
            </div>

            {/* Preferences Edit Form */}
            {editingPreferences && (
              <Card className="p-4 mb-4 border-2 border-orange-200">
                <h4 className="font-medium mb-4">Edit Job Preferences</h4>
                <div className="space-y-4">
                  {/* Job Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Types</label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Add job type (e.g., full-time, remote)"
                        value={newJobType}
                        onChange={(e) => setNewJobType(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addJobType()}
                      />
                      <Button onClick={addJobType} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tempPreferences.jobTypes?.map(type => (
                        <span key={type} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md flex items-center">
                          {type}
                          <button onClick={() => removeJobType(type)} className="ml-1 text-green-600 hover:text-green-800">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Locations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Add location (e.g., San Francisco, Remote)"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                      />
                      <Button onClick={addLocation} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tempPreferences.locations?.map(location => (
                        <span key={location} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {location}
                          <button onClick={() => removeLocation(location)} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Industries</label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Add industry (e.g., Technology, Fintech)"
                        value={newIndustry}
                        onChange={(e) => setNewIndustry(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addIndustry()}
                      />
                      <Button onClick={addIndustry} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tempPreferences.industries?.map(industry => (
                        <span key={industry} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md flex items-center">
                          {industry}
                          <button onClick={() => removeIndustry(industry)} className="ml-1 text-purple-600 hover:text-purple-800">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Salary Expectation */}
                  <Input
                    label="Salary Expectation ($/year)"
                    type="number"
                    value={tempPreferences.salaryExpectation}
                    onChange={(e) => setTempPreferences({ ...tempPreferences, salaryExpectation: e.target.value })}
                    placeholder="85000"
                  />

                  <div className="flex space-x-2">
                    <Button onClick={savePreferences}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPreferences(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Preferences Display */}
            {profile.preferences && Object.keys(profile.preferences).length > 0 && 
             (profile.preferences.jobTypes?.length > 0 || profile.preferences.locations?.length > 0 || 
              profile.preferences.industries?.length > 0 || profile.preferences.salaryExpectation) ? (
              <div className="space-y-4">
                {profile.preferences.jobTypes?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Preferred Job Types</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.jobTypes.map(type => (
                        <span key={type} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.preferences.locations?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Preferred Locations</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.locations.map(location => (
                        <span key={location} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.preferences.industries?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Preferred Industries</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.industries.map(industry => (
                        <span key={industry} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.preferences.salaryExpectation && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Salary Expectation</p>
                    <p className="text-gray-700">${Number(profile.preferences.salaryExpectation).toLocaleString()}/year</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No preferences set yet</p>
                <Button className="mt-4" variant="outline" onClick={startEditPreferences}>
                  <Plus className="w-4 h-4 mr-2" />
                  Set Preferences
                </Button>
              </div>
            )}
          </Card>

          {/* Skill Assessments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Skill Assessments</h3>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('assessments')}>
                <Award className="w-4 h-4 mr-2" />
                Take Assessment
              </Button>
            </div>
            {profile.skillAssessments?.length > 0 ? (
              <div className="space-y-3">
                {profile.skillAssessments.map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{assessment.skill}</p>
                      <p className="text-sm text-gray-600">
                        Score: {assessment.score}/{assessment.maxScore} ({assessment.level})
                      </p>
                      <p className="text-xs text-gray-500">
                        Completed: {new Date(assessment.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Award className={`${
                        assessment.level === 'Advanced' ? 'text-green-500' :
                        assessment.level === 'Intermediate' ? 'text-yellow-500' : 'text-gray-500'
                      }`} size={20} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No assessments completed yet</p>
                <Button className="mt-4" onClick={() => setCurrentView('assessments')}>Take Your First Assessment</Button>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{user?.name}</h4>
              <p className="text-gray-600">{profile.major}</p>
              <p className="text-sm text-gray-500">{profile.university}</p>
              {profile.gpa && (
                <p className="text-sm text-gray-500">GPA: {profile.gpa}</p>
              )}
              
              {/* Social Links */}
              <div className="flex justify-center space-x-4 mt-4">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Github size={24} />
                  </a>
                )}
                {profile.linkedIn && (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <BookOpen size={24} />
                  </a>
                )}
              </div>
            </div>
          </Card>

          {/* Profile Completion */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Profile Completion</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{profile.profileCompletion || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profile.profileCompletion || 0}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Complete your profile to increase visibility to employers
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Upload size={16} className="mr-2" />
                Upload Resume
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentView('assessments')}>
                <Award size={16} className="mr-2" />
                Take Skill Test
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={startAddProject}>
                <Plus size={16} className="mr-2" />
                Add Project
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
