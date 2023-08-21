import { isValueExist, validateEmail, validateOnlyLetters, validatePassword } from '../app/utils/validation/input-validation';

describe('Input validation tests', () => {
  test('Value exists', () => {
    expect(isValueExist('').isValid).toBeFalsy();
    expect(isValueExist('a')).toBeTruthy();
    expect(isValueExist('1')).toBeTruthy();
    expect(isValueExist('@')).toBeTruthy();
  });

  test('Email is valid', () => {
    expect(validateEmail('t@t.by')).toBeTruthy();
    expect(validateEmail('t@t').isValid).toBeFalsy();
  });

  test('Password is valid', () => {
    expect(validatePassword('Secret123')).toBeTruthy();
    expect(validatePassword('aAaaaaaa1')).toBeTruthy();
    expect(validatePassword('BBBBBBBB2b')).toBeTruthy();
    expect(validatePassword('secret123').isValid).toBeFalsy();
  });

  test('Onli letters in string', () => {
    expect(validateOnlyLetters('Secret123')).toBeTruthy();
    expect(validateOnlyLetters('aAaaaaaa1').isValid).toBeFalsy();
    expect(validateOnlyLetters('BBBBBBBB2b').isValid).toBeFalsy();
    expect(validateOnlyLetters('secret123').isValid).toBeFalsy();
  });
});
