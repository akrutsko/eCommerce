import {
  isValueExist,
  validateCountry,
  validateEmail,
  validateOnlyLetters,
  validatePassword,
} from '../app/utils/validation/input-validation';

describe('Input validation tests', () => {
  test('Value exists', () => {
    expect(isValueExist('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(isValueExist('a')).toEqual({ isValid: true });
    expect(isValueExist('1')).toEqual({ isValid: true });
    expect(isValueExist('@')).toEqual({ isValid: true });
  });

  test('Email is valid', () => {
    expect(validateEmail('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(validateEmail('t@t.by')).toEqual({ isValid: true });
    expect(validateEmail('t@t')).toEqual({ isValid: false, message: 'Invalid email address format' });
  });

  test('Password is valid', () => {
    expect(validatePassword('Secret123')).toEqual({ isValid: true });
    expect(validatePassword('aAaaaaaa1')).toEqual({ isValid: true });
    expect(validatePassword('BBBBBBBB2b')).toEqual({ isValid: true });
    expect(validatePassword('secret123')).toEqual({
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    });
    expect(validatePassword('s')).toEqual({
      isValid: false,
      message: 'Password must be at least 8 characters long',
    });
  });

  test('Only letters in string', () => {
    expect(validateOnlyLetters('Secret')).toEqual({ isValid: true });
    expect(validateOnlyLetters('a1')).toEqual({ isValid: false, message: 'This field must contain only letters' });
    expect(validateOnlyLetters('a b')).toEqual({ isValid: true });
    expect(validateOnlyLetters('a#b')).toEqual({ isValid: false, message: 'This field must contain only letters' });
  });

  test('Validate country', () => {
    expect(validateCountry('')).toEqual({ isValid: false, message: 'This field is required' });
    expect(validateCountry('Belarus')).toEqual({ isValid: true });
    expect(validateCountry('B')).toEqual({ isValid: false, message: 'Invalid country' });
  });
});
