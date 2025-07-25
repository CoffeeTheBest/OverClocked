
export const handleApiError = (error: any): string => {
  // Handle validation errors
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors
      .map((err: any) => err.msg || err.message)
      .join(', ');
  }
  
  // Handle single error message
  if (error.response?.data?.msg) {
    return error.response.data.msg;
  }
  
  // Handle generic error message
  if (error.message) {
    return error.message;
  }
  
  // Fallback error message
  return "Something went wrong. Please try again.";
};

export const isValidationError = (error: any): boolean => {
  return error.response?.status === 400 && error.response?.data?.errors;
};

export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};

export const isRateLimitError = (error: any): boolean => {
  return error.response?.status === 429;
};
