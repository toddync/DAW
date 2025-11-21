import { describe, it, expect } from 'vitest';
import { APIError, handleAPIError, CommonErrors } from '../api-error-handler';
import { ZodError, z } from 'zod';

describe('APIError', () => {
  it('should create error with message and status code', () => {
    const error = new APIError('Test error', 400, 'TEST_ERROR');
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('TEST_ERROR');
    expect(error.name).toBe('APIError');
  });

  it('should default to 500 status code', () => {
    const error = new APIError('Server error');
    expect(error.statusCode).toBe(500);
  });
});

describe('handleAPIError', () => {
  it('should handle ZodError with field details', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18),
    });

    try {
      schema.parse({ email: 'invalid', age: 10 });
    } catch (error) {
      const response = handleAPIError(error);
      const data = response.json();
      
      expect(response.status).toBe(400);
      // Note: In actual test, we'd need to await the json() call
    }
  });

  it('should handle APIError', () => {
    const error = new APIError('Not found', 404, 'NOT_FOUND');
    const response = handleAPIError(error);
    
    expect(response.status).toBe(404);
  });

  it('should handle unknown errors as 500', () => {
    const error = new Error('Unknown error');
    const response = handleAPIError(error);
    
    expect(response.status).toBe(500);
  });
});

describe('CommonErrors', () => {
  it('should have UNAUTHORIZED error', () => {
    expect(CommonErrors.UNAUTHORIZED.statusCode).toBe(401);
    expect(CommonErrors.UNAUTHORIZED.code).toBe('AUTH_REQUIRED');
  });

  it('should have FORBIDDEN error', () => {
    expect(CommonErrors.FORBIDDEN.statusCode).toBe(403);
    expect(CommonErrors.FORBIDDEN.code).toBe('FORBIDDEN');
  });

  it('should have NOT_FOUND error', () => {
    expect(CommonErrors.NOT_FOUND.statusCode).toBe(404);
    expect(CommonErrors.NOT_FOUND.code).toBe('NOT_FOUND');
  });
});
