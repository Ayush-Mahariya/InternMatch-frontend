import React, { useState, useEffect } from 'react';
import { Award, Clock, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AssessmentModal from './AssessmentModal';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      // Updated to use new API endpoint (no auth required for listing)
      const response = await fetch(`${API_BASE_URL}/api/assessments/`);
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      } else {
        console.error('Failed to fetch assessments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const takeAssessment = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const closeModal = () => {
    setSelectedAssessment(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading assessments...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 py-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skill Assessments</h1>
          <p className="text-gray-600 mt-1">Test your skills and improve your profile</p>
        </div>

        <div className="grid gap-6">
          {assessments.length === 0 ? (
            <Card className="p-8 text-center">
              <Award className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No assessments available at the moment.</p>
            </Card>
          ) : (
            assessments.map(assessment => (
              <Card key={assessment._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{assessment.title}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {assessment.skill}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {assessment.duration} minutes
                      </div>
                      <div className="flex items-center">
                        <FileText size={16} className="mr-1" />
                        {assessment.questionsForEachTest} questions
                      </div>
                      <div className="flex items-center">
                        <Award size={16} className="mr-1" />
                        Pass: {assessment.passingScore}/{assessment.questionsForEachTest}
                      </div>
                    </div>
                    
                    <p className="text-gray-700">
                      Test your {assessment.skill} knowledge with {assessment.questionsForEachTest} randomly selected questions 
                      from our pool of {assessment.totalQuestions} questions. Earn a verified skill badge upon passing.
                    </p>
                    
                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Total Questions: {assessment.totalQuestions}</span>
                      <span>•</span>
                      <span>Pass Rate: {Math.round((assessment.passingScore / assessment.questionsForEachTest) * 100)}%</span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button onClick={() => takeAssessment(assessment)}>
                      Take Assessment
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Assessment Modal */}
      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default AssessmentsList;
