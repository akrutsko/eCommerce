import 'jest-fetch-mock';
import { Consumer } from '../../app/components/consumer/consumer';
import { Registration } from '../../app/components/registration/registration';
import { Router } from '../../app/router/router';

describe('Registration form component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Registration is added to the DOM', () => {
    const router = new Router();
    const consumer = new Consumer();

    const registration = new Registration(router, consumer);

    document.body.append(registration.getElement());

    expect(document.querySelector('.registration-form')).toBeInTheDocument();
  });
});
