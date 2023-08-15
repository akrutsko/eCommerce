import { Login } from '../app/components/login/login';

describe('Login form component', () => {
  test('Login is added to the DOM', () => {
    const login = new Login();
    document.body.append(login.getElement());

    expect(document.querySelector('.login-form')).toBeInTheDocument();
  });
});
