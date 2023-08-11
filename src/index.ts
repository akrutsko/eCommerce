import {
  attachToken,
  logInWithPassword,
  logOut,
  testCreateCustomer,
  testGetCustomerData,
} from './app/utils/api/api';

(async (): Promise<void> => {
  localStorage.clear();
  await testCreateCustomer();
  await testGetCustomerData();
  logOut();
  await logInWithPassword({ email: 'ak@test.com', password: 'ak' });
  await testGetCustomerData();
  const { token } = localStorage;
  logOut();
  localStorage.token = token;
  attachToken();
  await testGetCustomerData();
})();
