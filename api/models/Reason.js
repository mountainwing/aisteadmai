// Reasons data model for MongoDB

export const ReasonsModel = {
  _id: 'ObjectId', // Auto-generated MongoDB ID
  title: 'String', // Reason title
  description: 'String', // Reason description  
  order: 'Number', // Display order for sorting
  createdBy: 'String', // Username who created it
  updatedBy: 'String', // Username who last updated it
  createdAt: 'Date', // Creation timestamp
  updatedAt: 'Date' // Last update timestamp
};

// Interface for TypeScript (if needed)
export const ReasonInterface = {
  _id: 'string',
  title: 'string',
  description: 'string', 
  order: 'number',
  createdBy: 'string',
  updatedBy: 'string',
  createdAt: 'Date',
  updatedAt: 'Date'
};