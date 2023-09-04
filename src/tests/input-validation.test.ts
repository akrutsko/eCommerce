import {
  isValueExist,
  validateCountry,
  validateDateOfBirth,
  validateEmail,
  validateOnlyLetters,
  validatePassword,
  validatePostalCode,
} from '../app/utils/validation/input-validation';

describe('Input validation tests', () => {
  test('value exists', () => {
    expect(isValueExist('test')).toEqual({ isValid: true });
    expect(isValueExist('')).toEqual({ isValid: false, message: 'This field is required' });
  });

  test('email is valid', () => {
    expect(validateEmail('t@t.by')).toEqual({ isValid: true });
    expect(validateEmail('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(validateEmail(' test@example.com')).toEqual({
      isValid: false,
      message: 'Remove redundant leading and trailing whitespace',
    });
    expect(validateEmail('t@t')).toEqual({ isValid: false, message: 'Invalid email address format' });
  });

  test('password is valid', () => {
    expect(validatePassword('Secret123')).toEqual({ isValid: true });
    expect(validatePassword('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(validatePassword('Secret123 ')).toEqual({
      isValid: false,
      message: 'Remove redundant leading and trailing whitespace',
    });
    expect(validatePassword('s')).toEqual({
      isValid: false,
      message: 'Password must be at least 8 characters long',
    });
    expect(validatePassword('SECRET123')).toEqual({
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    });
    expect(validatePassword('secret123')).toEqual({
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    });
    expect(validatePassword('Secretttt')).toEqual({
      isValid: false,
      message: 'Password must contain at least one digit',
    });
    expect(validatePassword('Secret123', 'Secret124')).toEqual({
      isValid: false,
      message: 'Passwords do not match',
    });
  });

  test('date of birth is valid', () => {
    expect(validateDateOfBirth('2000-10-10')).toEqual({ isValid: true });
    expect(validateDateOfBirth('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(validateDateOfBirth('2000-10-101')).toEqual({ isValid: false, message: 'Invalid date format' });
    expect(validateDateOfBirth('2222-10-10')).toEqual({ isValid: false, message: 'You must be at least 14 years old' });
  });

  test('country is valid', () => {
    expect(validateCountry('Belarus')).toEqual({ isValid: true });
    expect(validateCountry('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(validateCountry('Belarusland')).toEqual({ isValid: false, message: 'Invalid country' });
  });

  test('postalcode is valid', () => {
    expect(validatePostalCode('222222', 'Belarus')).toEqual({ isValid: true });
    expect(validatePostalCode('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(validatePostalCode('222222')).toEqual({ isValid: false, message: 'Choose country' });
    expect(validatePostalCode('222222', 'Belarusland')).toEqual({ isValid: false, message: 'Choose valid country' });
    expect(validatePostalCode('22222', 'Belarus')).toEqual({ isValid: false, message: 'Incorrect postal code format' });
  });

  test('value is only letters', () => {
    expect(validateOnlyLetters('Secret')).toEqual({ isValid: true });
    expect(validateOnlyLetters('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(validateOnlyLetters('a#b')).toEqual({ isValid: false, message: 'This field must contain only letters' });
    expect(validateOnlyLetters(' ')).toEqual({ isValid: false, message: 'This field must contain at least one character' });
  });
});
