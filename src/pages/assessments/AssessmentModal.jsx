import React, { useState } from 'react';
import { X, Clock, FileText, Award, Users, Target, CheckCircle, AlertTriangle, BookOpen, TrendingUp, Star } from 'lucide-react';
import Button from '../../components/ui/Button';
import AssessmentTest from './AssessmentTest';

const AssessmentModal = ({ assessment, onClose }) => {
  const [currentStep, setCurrentStep] = useState('instructions'); // 'instructions' | 'test' | 'results'
  const [testResults, setTestResults] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleStartTest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Call the new /start endpoint to get random questions
      const response = await fetch(`${API_BASE_URL}/api/assessments/${assessment._id}/start`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssessmentData(data);
        setCurrentStep('test');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to start assessment');
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      alert('Failed to start assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = (results) => {
    setTestResults(results);
    setCurrentStep('results');
  };

  const handleRetakeTest = () => {
    setCurrentStep('instructions');
    setTestResults(null);
    setAssessmentData(null);
  };

  const renderInstructions = () => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <p className="text-blue-100 mt-1">Professional Skill Assessment</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Assessment Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center mb-3">
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Duration</h3>
                <p className="text-2xl font-bold text-blue-600">{assessment.duration} min</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Complete within the time limit</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center mb-3">
              <FileText className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Questions</h3>
                <p className="text-2xl font-bold text-green-600">{assessment.questionsForEachTest}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Randomly selected from {assessment.totalQuestions} total</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center mb-3">
              <Target className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Passing Score</h3>
                <p className="text-2xl font-bold text-purple-600">{assessment.passingScore}/{assessment.questionsForEachTest}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{Math.round((assessment.passingScore / assessment.questionsForEachTest) * 100)}% minimum to pass</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center mb-3">
              <Award className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Skill Level</h3>
                <p className="text-2xl font-bold text-orange-600">{assessment.skill}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Professional assessment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Instructions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Test Instructions */}
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Test Instructions</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Random Question Selection</h4>
                    <p className="text-gray-700">You will get <strong>{assessment.questionsForEachTest} randomly selected questions</strong> from our pool of {assessment.totalQuestions} questions. Each test attempt may have different questions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Time Management</h4>
                    <p className="text-gray-700">You have <strong>{assessment.duration} minutes</strong> to complete all questions. Time remaining will be displayed at the top right corner.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Question Format</h4>
                    <p className="text-gray-700">All questions are multiple-choice with 4 options each. Select the best answer for each question. Only one answer is correct per question.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Navigation & Review</h4>
                    <p className="text-gray-700">Use Previous/Next buttons or click on question numbers to navigate. You can change your answers and mark questions for review anytime before submission.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Auto-Submit</h4>
                    <p className="text-gray-700">The test will automatically submit when time expires. Unanswered questions will be marked as incorrect.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Scoring System */}
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Scoring & Performance Levels</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <h4 className="font-bold text-red-700">Beginner Level (0% - 69%)</h4>
                  </div>
                  <p className="text-red-600 text-sm">Fundamental understanding needed. Consider additional study and practice before applying for roles requiring this skill.</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                    <h4 className="font-bold text-yellow-700">Intermediate Level (70% - 89%)</h4>
                  </div>
                  <p className="text-yellow-600 text-sm">Good working knowledge. Suitable for junior to mid-level positions. Passing grade achieved.</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <h4 className="font-bold text-green-700">Advanced Level (90% - 100%)</h4>
                  </div>
                  <p className="text-green-600 text-sm">Expert proficiency demonstrated. Qualified for senior positions and leadership roles in this technology.</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">Minimum Passing Requirements</h4>
                </div>
                <p className="text-blue-700 text-sm">
                  You need to score at least <strong>{assessment.passingScore} out of {assessment.questionsForEachTest} questions 
                  ({Math.round((assessment.passingScore / assessment.questionsForEachTest) * 100)}%)</strong> to pass this assessment 
                  and earn a verified skill badge for your profile.
                </p>
              </div>
            </section>

            {/* Question Status Guide */}
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Question Status Guide</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded text-xs font-bold flex items-center justify-center">8</div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Current Question</h4>
                    <p className="text-blue-700 text-xs">Question you're currently viewing</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 text-white rounded text-xs font-bold flex items-center justify-center">2</div>
                  <div>
                    <h4 className="font-semibold text-green-900">Answered</h4>
                    <p className="text-green-700 text-xs">Questions with selected answers</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-6 h-6 bg-red-500 text-white rounded text-xs font-bold flex items-center justify-center">6</div>
                  <div>
                    <h4 className="font-semibold text-red-900">Visited</h4>
                    <p className="text-red-700 text-xs">Viewed but not answered</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-gray-400 text-white rounded text-xs font-bold flex items-center justify-center">12</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Not Visited</h4>
                    <p className="text-gray-700 text-xs">Questions not yet viewed</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-6 h-6 bg-green-500 text-white rounded text-xs font-bold flex items-center justify-center">3</div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-900">Marked for Review</h4>
                    <p className="text-orange-700 text-xs">Questions flagged for later review (orange dot indicator)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assessment Details */}
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-yellow-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-900">Assessment Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Technology</h4>
                  <p className="text-gray-700 text-sm">{assessment.skill}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Difficulty Level</h4>
                  <p className="text-gray-700 text-sm">Professional Level</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Question Pool</h4>
                  <p className="text-gray-700 text-sm">{assessment.totalQuestions} total questions</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Questions Per Test</h4>
                  <p className="text-gray-700 text-sm">{assessment.questionsForEachTest} randomly selected</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Question Types</h4>
                  <p className="text-gray-700 text-sm">Multiple Choice, Single Answer</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Attempts Allowed</h4>
                  <p className="text-gray-700 text-sm">One attempt per month</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Certification</h4>
                  <p className="text-gray-700 text-sm">Verified skill badge upon passing</p>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                <h3 className="text-lg font-bold text-yellow-900">Important Notes</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">Questions are randomly selected for each attempt</p>
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">Ensure stable internet connection throughout the test</p>
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">Do not refresh or close browser during the assessment</p>
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">Test cannot be paused once started</p>
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">Results will be available immediately after submission</p>
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">Passing score adds verified badge to your profile</p>
                </div>
              </div>
            </section>

            {/* Start Assessment */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Ready to Begin?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Make sure you have read all instructions and are prepared to complete the assessment in {assessment.duration} minutes.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleStartTest}
                  disabled={loading}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                  {loading ? 'Starting...' : 'I Agree, Start Assessment'}
                </Button>
                
                <Button 
                  onClick={onClose}
                  variant="outline"
                  className="w-full border-blue-300 text-white hover:bg-blue-800"
                >
                  Cancel
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6">
              {testResults?.passed ? (
                <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-full h-full bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-12 h-12 text-red-600" />
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {testResults?.passed ? 'Congratulations!' : 'Assessment Complete'}
            </h2>
            
            <div className="text-xl text-gray-600 mb-6">
              You scored <strong>{testResults?.score} out of {testResults?.maxScore}</strong> ({testResults?.percentage}%)
            </div>

            <div className="inline-block px-6 py-3 rounded-full text-lg font-semibold mb-6">
              {testResults?.level === 'Advanced' && (
                <span className="bg-green-100 text-green-800">🏆 Advanced Level</span>
              )}
              {testResults?.level === 'Intermediate' && (
                <span className="bg-yellow-100 text-yellow-800">⭐ Intermediate Level</span>
              )}
              {testResults?.level === 'Beginner' && (
                <span className="bg-red-100 text-red-800">📚 Beginner Level</span>
              )}
            </div>
          </div>

          {testResults?.passed && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                🎉 You've earned a verified {assessment.skill} badge!
              </h3>
              <p className="text-green-700">
                This badge will be added to your profile and visible to potential employers.
              </p>
            </div>
          )}

          {!testResults?.passed && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Keep Learning!
              </h3>
              <p className="text-blue-700 mb-2">
                You need {assessment.passingScore} correct answers to pass. 
                You got {testResults?.score} correct.
              </p>
              <p className="text-blue-600 text-sm">
                Review the material and try again when ready.
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={onClose} variant="outline" className="flex-1 py-3">
              Close
            </Button>
            {!testResults?.passed && (
              <Button onClick={handleRetakeTest} className="flex-1 py-3">
                Retake Assessment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentStep === 'instructions' && renderInstructions()}
      {currentStep === 'test' && assessmentData && (
        <AssessmentTest
          assessment={assessmentData}
          onComplete={handleTestComplete}
          onClose={onClose}
        />
      )}
      {currentStep === 'results' && renderResults()}
    </>
  );
};

export default AssessmentModal;
