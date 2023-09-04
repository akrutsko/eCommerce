import 'jest-fetch-mock';
import { Consumer } from '../../app/components/consumer/consumer';
import { Profile } from '../../app/components/profile/profile';
import { Router } from '../../app/router/router';

const router = new Router();
const consumer = new Consumer();

describe('Profile component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Profile is added to the DOM - getView', () => {
    const profile = new Profile(router, consumer);
    document.body.append(profile.getView().getElement());

    expect(document.querySelector('div')).toBeInTheDocument();
  });
  test('Profile is added to the DOM - getElement', () => {
    const cart = new Profile(router, consumer);
    document.body.append(cart.getElement());

    expect(document.querySelector('div')).toBeInTheDocument();
  });
});
