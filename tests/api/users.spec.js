import { test, expect } from '../../fixtures/apiFixtures.js';
import ApiAssertions from '../../api/ApiAssertions.js';
import SchemaValidator, {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from '../../utils/SchemaValidator.js';
import logger from '../../utils/Logger.js';

test.describe('API | Users CRUD Scenarios', () => {
  test('TC_API_001 | Create user - POST /api/users', async ({
    userService, newUser,
  }) => {
    logger.info('TC_API_001 - Create user');

    const response = await userService.createUser(newUser);

    ApiAssertions.assertCreateUserResponse(response, newUser);

    const { valid, errors } = SchemaValidator.validate(response.data, createUserSchema);
    expect(valid, `Schema errors: ${errors.join(', ')}`).toBe(true);
  });

  test('TC_API_002 | Read user - GET /api/users/{id}', async ({
    userService, validUserId,
  }) => {
    logger.info(`TC_API_002 - Read user id=${validUserId}`);

    // ReqRes does not persist the user created by POST, so we validate GET with a known static user id.
    const response = await userService.getUserById(validUserId);

    ApiAssertions.assertGetUserResponse(response, validUserId);

    const { valid, errors } = SchemaValidator.validate(response.data.data, getUserSchema);
    expect(valid, `Schema errors: ${errors.join(', ')}`).toBe(true);
  });

  test('TC_API_003 | Update user - PUT /api/users/{id}', async ({
    userService, validUserId, updatedUser,
  }) => {
    logger.info(`TC_API_003 - Update user id=${validUserId}`);

    const response = await userService.updateUser(validUserId, updatedUser);

    ApiAssertions.assertUpdateUserResponse(response, updatedUser);

    const { valid, errors } = SchemaValidator.validate(response.data, updateUserSchema);
    expect(valid, `Schema errors: ${errors.join(', ')}`).toBe(true);
  });

  test('TC_API_004 | Delete user - DELETE /api/users/{id}', async ({
    userService, validUserId,
  }) => {
    logger.info(`TC_API_004 - Delete user id=${validUserId}`);

    const response = await userService.deleteUser(validUserId);

    ApiAssertions.assertDeleteUserResponse(response);
    expect(response.data).toBeFalsy();
  });
});

test.describe('API | Users Negative Scenarios', () => {
  test('TC_API_NEG_001 | Invalid endpoint should return 404', async ({
    userService,
  }) => {
    logger.info('TC_API_NEG_001 - POST to invalid endpoint');

    const response = await userService.postToInvalidEndpoint();

    ApiAssertions.assertStatus(response, 404);
  });

  test('TC_API_NEG_002 | Invalid payload should be handled', async ({
    userService,
  }) => {
    logger.info('TC_API_NEG_002 - Create user with empty payload');

    // ReqRes mock API accepts empty payloads and still returns 201.
    const response = await userService.createUserWithEmptyPayload();

    ApiAssertions.assertStatus(response, 201);
    ApiAssertions.assertFieldExists(response.data, 'id');
    ApiAssertions.assertValidTimestamp(response.data, 'createdAt');
  });

  test('TC_API_NEG_003 | Retrieve non-existing user should return 404', async ({
    userService, invalidUserId,
  }) => {
    logger.info(`TC_API_NEG_003 - GET non-existing user id=${invalidUserId}`);

    const response = await userService.getNonExistentUser(invalidUserId);

    ApiAssertions.assertStatus(response, 404);
    expect(response.data).toEqual({});
  });
});
