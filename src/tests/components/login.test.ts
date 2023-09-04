import 'jest-fetch-mock';
import { Consumer } from '../../app/components/consumer/consumer';
import { Login } from '../../app/components/login/login';
import { Router } from '../../app/router/router';

const router = new Router();
const consumer = new Consumer();

describe('Login form component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Login is added to the DOM - getView', () => {
    const login = new Login(router, consumer);
    document.body.append(login.getView().getElement());

    expect(document.querySelector('.login-form')).toBeInTheDocument();
  });
  test('Login is added to the DOM - getElement', () => {
    const login = new Login(router, consumer);
    document.body.append(login.getElement());

    expect(document.querySelector('.login-form')).toBeInTheDocument();
  });
});
