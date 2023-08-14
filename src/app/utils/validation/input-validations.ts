import { countries, postalCodeRegexes } from './countries';

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) return { isValid: false, message: 'This field is required.' };
  if (!emailRegex.test(email)) return { isValid: false, message: 'Invalid email address format.' };

  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one digit.' };
  }

  return { isValid: true };
}

export function validateDateOfBirth(dateOfBirth: string): ValidationResult {
  const currentDate = new Date();
  const inputDate = new Date(dateOfBirth);

  const AGE_RESTRICTION = 14;
  const yearsDifference = currentDate.getFullYear() - inputDate.getFullYear();

  if (yearsDifference < AGE_RESTRICTION) {
    return { isValid: false, message: `You must be at least ${AGE_RESTRICTION} years old.` };
  }

  return { isValid: true };
}

export function validateCountry(country: string): ValidationResult {
  if (!countries.includes(country)) {
    return { isValid: false, message: 'Invalid country selection.' };
  }
  return { isValid: true };
}

export function validatePostalCode(country: string, postalCode: string): ValidationResult {
  if (!postalCodeRegexes[country].test(postalCode)) {
    return { isValid: false, message: 'Incorrect postal code format' };
  }
  return { isValid: true };
}

export function validateOnlyLetters(city: string): ValidationResult {
  if (!/^[A-Za-z\s]+$/.test(city)) {
    return { isValid: false, message: 'This field must contain only letters' };
  }
  return { isValid: true };
}

export function isValueExist(value: string): ValidationResult {
  if (!value) return { isValid: false, message: 'This field is required.' };
  return { isValid: true };
}
