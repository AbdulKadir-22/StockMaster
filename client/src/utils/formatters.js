// FILE: stockmaster-frontend/src/utils/formatters.js

/**
 * Formats a number as a currency string.
 * @param {number} amount 
 * @param {string} currency - Default 'USD'
 * @returns {string} e.g., "$1,200.00"
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Formats a date string into a readable format.
 * @param {string|Date} dateString 
 * @returns {string} e.g., "Oct 24, 2023"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats a date string including time.
 * @param {string|Date} dateString 
 * @returns {string} e.g., "Oct 24, 2023, 10:30 AM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};