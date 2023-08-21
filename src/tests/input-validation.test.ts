import { isValueExist, validateEmail, validatePassword } from '../app/utils/validation/input-validation';

describe('Input validation tests', () => {
  test('Value exists', () => {
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
});
