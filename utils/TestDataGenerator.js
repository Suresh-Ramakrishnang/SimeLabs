// utils/TestDataGenerator.js
// Centralised test data factory using @faker-js/faker.
// All dynamic test data is generated here — never hardcoded in tests.

import { faker } from '@faker-js/faker';

class TestDataGenerator {
  /**
   * Generate a complete user registration payload for automationexercise.com
   * @returns {Object} User registration data
   */
  static generateUserRegistration() {
    const firstName = faker.person.firstName('male');
    const lastName = faker.person.lastName();
    const timestamp = Date.now();

    return {
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: `qa.auto.${timestamp}@mailtest.dev`,
      password: `Test@${faker.number.int({ min: 1000, max: 9999 })}`,
      title: 'Mr',
      birthDay: String(faker.number.int({ min: 1, max: 28 })),
      birthMonth: String(faker.number.int({ min: 1, max: 12 })),
      birthYear: String(faker.number.int({ min: 1980, max: 2000 })),
      company: faker.company.name(),
      address: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'United States',
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode('#####'),
      mobileNumber: faker.phone.number('##########'),
    };
  }

  /**
   * Generate a new API user payload for reqres.in
   * @returns {Object} API user data
   */
  static generateApiUser() {
    return {
      name: faker.person.fullName(),
      job: faker.person.jobTitle(),
    };
  }

  /**
   * Generate updated user data (different from original)
   * @returns {Object} Updated user fields
   */
  static generateUpdatedApiUser() {
    return {
      name: faker.person.fullName(),
      job: faker.person.jobTitle(),
    };
  }

  /**
   * Generate a random invalid email (for negative tests)
   * @returns {string}
   */
  static generateInvalidEmail() {
    return `notanemail_${faker.number.int(9999)}`;
  }

  /**
   * Generate a valid-looking but non-existent user ID
   * @returns {number}
   */
  static generateNonExistentUserId() {
    return faker.number.int({ min: 9999, max: 99999 });
  }

  /**
   * Generate random credit card data (fake — for checkout form testing only)
   * @returns {Object}
   */
  static generatePaymentDetails() {
    return {
      nameOnCard: faker.person.fullName(),
      cardNumber: '4242424242424242', // Stripe test card
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2027',
    };
  }
}

export default TestDataGenerator;