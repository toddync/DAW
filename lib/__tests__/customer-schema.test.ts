import { describe, it, expect } from 'vitest';
import { customerUpdateSchema, customerCreateSchema } from '../schemas/customer';

describe('customerUpdateSchema', () => {
  it('should accept valid customer update data', () => {
    const validData = {
      nome: 'João Silva',
      email: 'joao@example.com',
      telefone: '+5511999999999',
      ativo: true,
    };

    const result = customerUpdateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
    };

    const result = customerUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Email inválido');
    }
  });

  it('should reject invalid phone', () => {
    const invalidData = {
      telefone: 'abc123',
    };

    const result = customerUpdateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept optional fields', () => {
    const minimalData = {};
    const result = customerUpdateSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('should reject unknown fields', () => {
    const dataWithExtra = {
      nome: 'João',
      unknownField: 'value',
    };

    const result = customerUpdateSchema.safeParse(dataWithExtra);
    expect(result.success).toBe(false);
  });
});

describe('customerCreateSchema', () => {
  it('should require nome and email', () => {
    const invalidData = {};
    const result = customerCreateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept valid create data', () => {
    const validData = {
      nome: 'Maria Santos',
      email: 'maria@example.com',
    };

    const result = customerCreateSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ativo).toBe(true); // default value
      expect(result.data.role).toBe('usuario'); // default value
    }
  });
});
