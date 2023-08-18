import 'jest-fetch-mock';
import { Consumer } from '../app/components/consumer/consumer';
import { Login } from '../app/components/login/login';
import { Router } from '../app/router/router';

const router = new Router();
const consumer = new Consumer();

describe('Login form component', () => {
  test('Login is added to the DOM', () => {
    const login = new Login(router, consumer);
    document.body.append(login.getElement());

    expect(document.querySelector('.login-form')).toBeInTheDocument();
  });
});
