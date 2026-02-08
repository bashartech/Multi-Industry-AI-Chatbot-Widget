export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - can be customized based on requirements
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateUserInfo = (userInfo: {
  name?: string;
  email?: string;
  phone?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (userInfo.name && userInfo.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (userInfo.email && !validateEmail(userInfo.email)) {
    errors.push('Please enter a valid email address');
  }

  if (userInfo.phone && !validatePhone(userInfo.phone)) {
    errors.push('Please enter a valid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};