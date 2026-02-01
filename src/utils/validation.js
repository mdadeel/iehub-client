/**
 * Validation utilities for the import-export application
 */

/**
 * Validates product quantity
 * @param {number} quantity - The quantity to validate
 * @returns {Object} Validation result with isValid flag and optional message
 */
export const validateProductQuantity = (quantity) => {
  if (typeof quantity !== 'number' || quantity < 0) {
    return {
      isValid: false,
      message: 'Quantity must be a positive number'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates product price
 * @param {number} price - The price to validate
 * @returns {Object} Validation result with isValid flag and optional message
 */
export const validateProductPrice = (price) => {
  if (typeof price !== 'number' || price < 0) {
    return {
      isValid: false,
      message: 'Price must be a positive number'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {Object} Validation result with isValid flag and optional message
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates required fields in an object
 * @param {Object} obj - The object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid flag and optional message
 */
export const validateRequiredFields = (obj, requiredFields) => {
  for (const field of requiredFields) {
    if (!obj[field] && obj[field] !== 0) {
      return {
        isValid: false,
        message: `${field} is required`
      };
    }
  }
  
  return { isValid: true };
};