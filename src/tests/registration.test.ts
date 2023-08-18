import { Consumer } from '../app/components/consumer/consumer';
import { Registration } from '../app/components/registration/registration';
import { Router } from '../app/router/router';

const router = new Router();
const consumer = new Consumer();

describe('Registration form component', () => {
  test('Registration is added to the DOM', () => {
    const registration = new Registration(router, consumer);
    document.body.append(registration.getElement());

    expect(document.querySelector('.registration-form')).toBeInTheDocument();
  });
});
