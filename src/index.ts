import { Consumer } from './app/components/consumer/consumer';

(async (): Promise<void> => {
  const customer = new Consumer();
  await customer.init();
  console.log('isRegistered:', customer.isConsumer);

  if (!customer.isConsumer) {
    await customer.logIn('ak@test.com', 'ak');
    console.log('isRegistered after log-in:', customer.isConsumer);
  }

  await customer.logOut();
  console.log('isRegistered after log-out:', customer.isConsumer);
})();
