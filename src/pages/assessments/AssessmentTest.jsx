import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, X, CheckCircle, AlertTriangle, Menu, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const AssessmentTest = ({ assessment, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(assessment.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // New states for tracking question status
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [markedForReview, setMarkedForReview] = useState(new Set());

  const { token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  // Mark question as visited when changed
  useEffect(() => {
    setVisitedQuestions(prev => new Set([...prev, currentQuestion]));
  }, [currentQuestion]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (displayIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [displayIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const handleMarkAndNext = () => {
    handleMarkForReview();
    if (currentQuestion < assessment.questions.length - 1) {
      handleNext();
    }
  };

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      // Create answers object mapping questionIndex to selected answer
      const answersToSubmit = {};
      assessment.questions.forEach((question, displayIndex) => {
        if (answers[displayIndex] !== undefined) {
          answersToSubmit[question.questionIndex] = answers[displayIndex];
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/assessments/${assessment.assessmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: answersToSubmit
        })
      });

      const result = await response.json();

      if (response.ok) {
        const results = {
          score: result.score,
          maxScore: result.maxScore,
          totalAnswered: result.totalAnswered,
          percentage: result.percentage,
          passed: result.passed,
          level: result.level,
          timeSpent: (assessment.duration * 60) - timeLeft
        };
        onComplete(results);
      } else {
        // Fallback - shouldn't happen with new API but keeping for safety
        console.error('Submission failed:', result.message);
        const answeredCount = Object.keys(answers).length;
        const percentage = Math.round((answeredCount / assessment.questions.length) * 100);
        
        const results = {
          score: answeredCount,
          maxScore: assessment.questions.length,
          totalAnswered: answeredCount,
          percentage,
          passed: percentage >= 50,
          level: percentage >= 90 ? 'Advanced' : percentage >= 70 ? 'Intermediate' : 'Beginner',
          timeSpent: (assessment.duration * 60) - timeLeft
        };
        onComplete(results);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      // Network error fallback
      const answeredCount = Object.keys(answers).length;
      const percentage = Math.round((answeredCount / assessment.questions.length) * 100);
      
      const results = {
        score: answeredCount,
        maxScore: assessment.questions.length,
        totalAnswered: answeredCount,
        percentage,
        passed: false, // Conservative approach on error
        level: 'Beginner',
        timeSpent: (assessment.duration * 60) - timeLeft
      };
      onComplete(results);
    }
  };

  // Get question status for styling
  const getQuestionStatus = (index) => {
    if (index === currentQuestion) return 'current';
    if (answers[index] !== undefined) return 'answered';
    if (visitedQuestions.has(index)) return 'visited';
    return 'not-visited';
  };

  // Question button class function - responsive sizes
  const getQuestionButtonClass = (index) => {
    const status = getQuestionStatus(index);
    
    let baseClass = 'relative w-7 h-7 sm:w-8 sm:h-8 rounded text-xs font-medium transition-all duration-200 ';
    
    switch (status) {
      case 'current':
        baseClass += 'bg-blue-600 text-white';
        break;
      case 'answered':
        baseClass += 'bg-green-500 text-white';
        break;
      case 'visited':
        baseClass += 'bg-red-500 text-white';
        break;
      default:
        baseClass += 'bg-gray-200 text-gray-600 hover:bg-gray-300';
    }
    
    return baseClass;
  };

  // Check if assessment and questions exist
  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">Loading assessment...</div>
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </div>
    );
  }

  const currentQuestionData = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = assessment.questions.length - answeredCount;
  const markedCount = markedForReview.size;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Ultra-Compact Responsive Header */}
      <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">
              {assessment.title}
            </h1>
            <p className="text-xs text-gray-600">
              Q{currentQuestion + 1}/{assessment.questions.length} • {assessment.skill}
            </p>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              <Menu size={18} />
            </button>

            {/* Ultra-Compact Progress */}
            <div className="hidden sm:block text-right">
              <div className="text-xs font-medium text-gray-900">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-gray-500">
                {answeredCount}/{assessment.questions.length}
              </div>
            </div>

            {/* Ultra-Compact Timer */}
            <div className={`flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-mono text-xs sm:text-sm font-bold ${
              timeLeft < 300 
                ? 'bg-red-100 text-red-700' 
                : timeLeft < 600
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock size={12} className="mr-1" />
              {formatTime(timeLeft)}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Ultra-Thin Progress Bar */}
        <div className="mt-1">
          <div className="w-full bg-gray-200 rounded-full h-0.5">
            <div 
              className="bg-blue-500 h-0.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Content - Responsive */}
        <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl sm:max-w-3xl">
            {/* Ultra-Compact Question Header */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                  Q{currentQuestion + 1}
                </span>
                
                {/* Ultra-Compact Mark for Review Button */}
                <button
                  onClick={handleMarkForReview}
                  className={`flex items-center px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                    markedForReview.has(currentQuestion)
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {markedForReview.has(currentQuestion) ? (
                    <CheckCircle size={10} className="mr-1" />
                  ) : (
                    <Bookmark size={10} className="mr-1" />
                  )}
                  <span className="hidden sm:inline">
                    {markedForReview.has(currentQuestion) ? 'Marked' : 'Mark for Review'}
                  </span>
                  <span className="sm:hidden">
                    {markedForReview.has(currentQuestion) ? 'Marked' : 'Mark'}
                  </span>
                </button>
              </div>
              
              <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {currentQuestionData.question}
              </h2>
            </div>
            
            {/* Ultra-Compact Answer Options */}
            <div className="space-y-2 sm:space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-start p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(currentQuestion, index)}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0 mt-0.5"
                  />
                  <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-900">
                    {option}
                  </span>
                </label>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className="lg:hidden mt-4 sm:mt-6 space-y-2">
              <div className="flex space-x-2">
                <Button
                  onClick={handleMarkAndNext}
                  variant="outline"
                  className="flex-1 py-2 text-xs sm:text-sm font-semibold"
                  disabled={currentQuestion === assessment.questions.length - 1}
                >
                  <Bookmark size={14} className="mr-1" />
                  Mark & Next
                </Button>
                <Button
                  onClick={handleSubmitClick}
                  className="flex-1 py-2 text-xs sm:text-sm font-semibold bg-green-600 hover:bg-green-700"
                >
                  <Flag size={14} className="mr-1" />
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra-Compact Desktop Sidebar */}
        <div className="hidden lg:flex w-48 xl:w-52 bg-white border-l border-gray-200 p-2 flex-col">
          <h3 className="font-semibold text-gray-900 mb-2 text-xs">Questions</h3>
          
          {/* Ultra-Compact Status Summary */}
          <div className="mb-2 p-1.5 bg-gray-50 rounded text-xs">
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="font-medium text-green-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <span className="font-medium text-red-600">{unansweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Marked:</span>
                <span className="font-medium text-orange-600">{markedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Not Visited:</span>
                <span className="font-medium text-gray-600">{assessment.questions.length - visitedQuestions.size}</span>
              </div>
            </div>
          </div>
          
          {/* Ultra-Compact Question Grid */}
          <div className="flex-1 mb-2">
            <div className="max-h-40 overflow-y-auto">
              <div className="grid grid-cols-5 xl:grid-cols-5 gap-1.5">
                {assessment.questions.map((_, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={() => setCurrentQuestion(index)}
                      className={getQuestionButtonClass(index)}
                    >
                      {index + 1}
                    </button>
                    {markedForReview.has(index) && (
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full">
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ultra-Compact Legend */}
          <div className="space-y-0.5 mb-2 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded mr-1.5"></div>
              <span className="text-gray-700">Current</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded mr-1.5"></div>
              <span className="text-gray-700">Answered</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded mr-1.5"></div>
              <span className="text-gray-700">Visited</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-200 rounded mr-1.5"></div>
              <span className="text-gray-700">Not Visited</span>
            </div>
          </div>

          {/* Ultra-Compact Action Buttons */}
          <div className="space-y-1.5">
            <Button
              onClick={handleMarkAndNext}
              variant="outline"
              className="w-full py-1.5 text-xs font-semibold"
              disabled={currentQuestion === assessment.questions.length - 1}
            >
              <Bookmark size={12} className="mr-1" />
              Mark & Next
            </Button>
            
            <Button
              onClick={handleSubmitClick}
              className="w-full py-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700"
            >
              <Flag size={12} className="mr-1" />
              Submit Test
            </Button>
          </div>

          {/* Ultra-Compact Warning */}
          {(unansweredCount > 0 || markedCount > 0) && (
            <div className="mt-2 p-1.5 bg-yellow-50 border border-yellow-200 rounded text-xs">
              {unansweredCount > 0 && (
                <p className="font-medium text-yellow-800">
                  {unansweredCount} unanswered
                </p>
              )}
              {markedCount > 0 && (
                <p className="font-medium text-orange-800">
                  {markedCount} marked
                </p>
              )}
            </div>
          )}
        </div>

        {/* Responsive Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>
            
            <div className="relative ml-auto w-72 sm:w-80 max-w-full bg-white h-full p-3 shadow-xl overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Questions</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Mobile Status Summary */}
              <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                <div className="grid grid-cols-2 gap-1">
                  <div>Answered: <span className="font-medium text-green-600">{answeredCount}</span></div>
                  <div>Unanswered: <span className="font-medium text-red-600">{unansweredCount}</span></div>
                  <div>Marked: <span className="font-medium text-orange-600">{markedCount}</span></div>
                  <div>Not Visited: <span className="font-medium text-gray-600">{assessment.questions.length - visitedQuestions.size}</span></div>
                </div>
              </div>
              
              {/* Mobile Question Grid */}
              <div className="mb-4">
                <div className="grid grid-cols-6 sm:grid-cols-7 gap-1">
                  {assessment.questions.map((_, index) => (
                    <div key={index} className="relative">
                      <button
                        onClick={() => {
                          setCurrentQuestion(index);
                          setSidebarOpen(false);
                        }}
                        className={getQuestionButtonClass(index).replace('w-7 h-7 sm:w-8 sm:h-8', 'w-8 h-8 sm:w-9 sm:h-9')}
                      >
                        {index + 1}
                      </button>
                      {markedForReview.has(index) && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full">
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Legend */}
              <div className="mb-3 space-y-1 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  <span>Visited (Not Answered)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
                  <span>Not Visited</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ultra-Compact Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-2 sm:px-4 py-1.5 sm:py-2">
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
          >
            <ChevronLeft size={14} className="mr-1" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              {currentQuestion + 1} / {assessment.questions.length}
            </span>
            
            <div className="hidden lg:block">
              <Button
                onClick={handleMarkAndNext}
                variant="outline"
                className="flex items-center px-3 py-1.5 text-xs"
                disabled={currentQuestion === assessment.questions.length - 1}
              >
                <Flag size={12} className="mr-1" />
                Mark & Next
              </Button>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentQuestion === assessment.questions.length - 1}
            className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full mx-2">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Submit Assessment?
              </h3>
              
              {/* Ultra-Compact Status */}
              <div className="text-left mb-4 p-2 sm:p-3 bg-gray-50 rounded text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <div className="text-green-600">✓ Answered: {answeredCount}</div>
                  <div className="text-red-600">✗ Unanswered: {unansweredCount}</div>
                  <div className="text-orange-600">📑 Marked: {markedCount}</div>
                  <div className="text-gray-600">👁 Not Visited: {assessment.questions.length - visitedQuestions.size}</div>
                </div>
              </div>
              
              {(unansweredCount > 0 || markedCount > 0) && (
                <p className="text-xs sm:text-sm text-orange-600 font-medium mb-4">
                  {unansweredCount > 0 && `${unansweredCount} unanswered questions will be marked incorrect. `}
                  {markedCount > 0 && `${markedCount} questions are marked for review.`}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => setShowSubmitConfirm(false)}
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm py-2"
                >
                  Continue Review
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 text-xs sm:text-sm py-2 bg-green-600 hover:bg-green-700"
                >
                  Submit Final
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentTest;
