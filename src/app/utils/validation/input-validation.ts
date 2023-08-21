import { ValidationResult } from '../../types/validation-result-type';
import { countries, postalCodeRegexes } from './countries';

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
  const { isValid, message } = isTrimmed(email);
  if (!isValid) return { isValid, message };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) return { isValid: false, message: 'This field is required' };
  if (!emailRegex.test(email)) return { isValid: false, message: 'Invalid email address format' };

  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  const { isValid, message } = isTrimmed(password);
  if (!isValid) return { isValid, message };

  if (!password) return { isValid: false, message: 'This field is required' };
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one digit' };
  }

  return { isValid: true };
}

export function validateDateOfBirth(dateOfBirth: string): ValidationResult {
  const AGE_RESTRICTION = 14;

  const currentDate = new Date();
  const inputDate = new Date(dateOfBirth);

  if (dateOfBirth.length !== 10) {
    return { isValid: false, message: 'Invalid date format' };
  }

  const yearsDifference = currentDate.getFullYear() - inputDate.getFullYear();
  const monthsDifference = currentDate.getMonth() - inputDate.getMonth();
  const daysDifference = currentDate.getDate() - inputDate.getDate();

  const isYearValid = yearsDifference < AGE_RESTRICTION;
  const isMonthValid = yearsDifference === AGE_RESTRICTION && monthsDifference < 0;
  const isDayValid = yearsDifference === AGE_RESTRICTION && monthsDifference === 0 && daysDifference < 0;

  if (isYearValid || isMonthValid || isDayValid) {
    return { isValid: false, message: `You must be at least ${AGE_RESTRICTION} years old` };
  }

  return { isValid: true };
}

export function validateCountry(country: string): ValidationResult {
  if (!countries.includes(country)) {
    return { isValid: false, message: 'Invalid country selection.' };
  }
  return { isValid: true };
}

export function validatePostalCode(country: string, postalCode?: string): ValidationResult {
  if (!country) return { isValid: false, message: 'Please choose country' };
  if (!postalCode) return { isValid: false, message: 'This field is required' };

  const regex = postalCodeRegexes[country];

  if (!regex) return { isValid: false, message: 'Please choose available country' };
  if (!regex.test(postalCode)) {
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
