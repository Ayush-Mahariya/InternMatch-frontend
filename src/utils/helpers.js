// Utility functions for common operations
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'applied': return 'bg-blue-100 text-blue-800';
    case 'reviewed': return 'bg-yellow-100 text-yellow-800';
    case 'shortlisted': return 'bg-purple-100 text-purple-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'hired': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
