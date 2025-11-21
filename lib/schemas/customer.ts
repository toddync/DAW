import { z } from 'zod';

/**
 * Validation schema for updating customer/user data
 * Enforces data integrity and prevents bad inputs (Nielsen Heuristic #5: Error prevention)
 */
export const customerUpdateSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional(),
  
  email: z.string()
    .email('Email inválido')
    .optional(),
  
  telefone: z.string()
    .regex(/^[\d\+\-\(\)\s]{10,20}$/, 'Telefone inválido')
    .optional()
    .or(z.literal(''))  // Allow empty string
    .transform(val => val === '' ? undefined : val),  // Transform empty to undefined
  
  ativo: z.boolean()
    .optional(),
  
  role: z.enum(['usuario', 'admin'], {
    errorMap: () => ({ message: 'Função deve ser "usuario" ou "admin"' }),
  }).optional(),
}).strict(); // Reject unknown fields

/**
 * TypeScript type inferred from schema
 * Use this for type-safe form submissions
 */
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;

/**
 * Schema for creating new customers (stricter requirements)
 */
export const customerCreateSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: z.string()
    .email('Email inválido'),
  
  telefone: z.string()
    .regex(/^[\d\+\-\(\)\s]{10,20}$/, 'Telefone inválido')
    .optional()
    .nullable(),
  
  ativo: z.boolean()
    .default(true),
  
  role: z.enum(['usuario', 'admin'])
    .default('usuario'),
}).strict();

export type CustomerCreateInput = z.infer<typeof customerCreateSchema>;
