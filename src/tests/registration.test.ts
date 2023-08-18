import { Registration } from '../app/components/registration/registration';
import { Router } from '../app/router/router';

describe('Registration form component', () => {
  test('Registration is added to the DOM', () => {
    const router = new Router();
    const registration = new Registration(router);
    document.body.append(registration.getElement());

    expect(document.querySelector('.registration-form')).toBeInTheDocument();
  });
});
