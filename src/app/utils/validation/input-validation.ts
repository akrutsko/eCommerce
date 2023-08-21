import { ValidationResult } from '../../types/validation-result-type';
import { countries, postalCodeRegexes } from '../../data/countries';

function isTrimmed(value: string): ValidationResult {
  if (value.trim().length !== value.length) {
    return { isValid: false, message: 'Remove redundant leading and trailing whitespace' };
  }
  return { isValid: true };
}

export function isValueExist(value: string): ValidationResult {
  if (!value) return { isValid: false, message: 'This field is required' };
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) return { isValid: false, message: 'This field is required' };

  const { isValid, message } = isTrimmed(email);
  if (!isValid) return { isValid, message };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { isValid: false, message: 'Invalid email address format' };

  return { isValid: true };
}

export function validatePassword(primaryPassword: string, secondaryPassword?: string): ValidationResult {
  if (!primaryPassword) return { isValid: false, message: 'This field is required' };

  const { isValid, message } = isTrimmed(primaryPassword);
  if (!isValid) return { isValid, message };

  if (primaryPassword.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[a-z]/.test(primaryPassword)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[A-Z]/.test(primaryPassword)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/\d/.test(primaryPassword)) {
    return { isValid: false, message: 'Password must contain at least one digit' };
  }

  if (secondaryPassword && secondaryPassword !== primaryPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  return { isValid: true };
}

export function validateDateOfBirth(dateOfBirth: string): ValidationResult {
  if (!dateOfBirth) return { isValid: false, message: 'This field is required' };

  const AGE_RESTRICTION = 14;

  const currentDate = new Date();
  const inputDate = new Date(dateOfBirth);
  const yearsDifference = currentDate.getFullYear() - inputDate.getFullYear();

  if (yearsDifference < AGE_RESTRICTION) {
    return { isValid: false, message: `You must be at least ${AGE_RESTRICTION} years old` };
  }

  return { isValid: true };
}

export function validateCountry(country: string): ValidationResult {
  if (!country) return { isValid: false, message: 'This field is required' };

  if (!countries.includes(country)) {
    return { isValid: false, message: 'Invalid country' };
  }
  return { isValid: true };
}

export function validatePostalCode(postalCode: string, country?: string): ValidationResult {
  if (!postalCode) return { isValid: false, message: 'This field is required' };
  if (!country) return { isValid: false, message: 'Choose country' };

  const regex = postalCodeRegexes[country];

  if (!regex) return { isValid: false, message: 'Choose valid country' };
  if (!regex.test(postalCode)) {
    return { isValid: false, message: 'Incorrect postal code format' };
  }
  return { isValid: true };
}

export function validateOnlyLetters(input: string): ValidationResult {
  if (!input) return { isValid: false, message: 'This field is required' };

  if (!/^[A-Za-z\s]+$/.test(input)) {
    return { isValid: false, message: 'This field must contain only letters' };
  }
  if (input.trim().length !== input.length) {
    return { isValid: false, message: 'This field must contain at least one character' };
  }
  return { isValid: true };
}
