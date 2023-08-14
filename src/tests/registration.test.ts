import { Registration } from '../app/components/registration/registration';

describe('Registration form component', () => {
  test('Registration is added to the DOM', () => {
    const registration = new Registration();
    document.body.append(registration.getElement());

    expect(document.querySelector('.registration-form')).toBeInTheDocument();
  });
});
