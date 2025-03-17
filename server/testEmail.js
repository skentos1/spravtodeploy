import { sendJobCreationEmail } from './mailer.js';

const testJobDetails = {
  email: 'kentos.simon1@gmail.com',
  title: 'Test Práca',
  category: 'Kategória 1',
  estimatedTime: 5,
  address: 'Testovacia 123',
  price: 100,
  firstName: 'Simon',
  lastName: 'Kentos',
  phoneNumber: '0907123456',
  jobNumber: 1234567890,
  description: 'Toto je testovací popis práce.',
};

console.log('Attempting to send test email...');

sendJobCreationEmail(testJobDetails)
  .then(() => console.log('Test email sent successfully'))
  .catch(error => console.error('Error sending test email:', error));
