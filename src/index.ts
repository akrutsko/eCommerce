import { Customer } from './app/components/customer/customer';

(async (): Promise<void> => {
  const customer = new Customer();
  await customer.init();
  console.log('isRegistered:', customer.isRegistered);

  if (!customer.isRegistered) {
    await customer.logIn('ak@test.com', 'ak');
    console.log('isRegistered after log-in:', customer.isRegistered);
  }

  await customer.logOut();
  console.log('isRegistered after log-out:', customer.isRegistered);
})();
