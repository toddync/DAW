import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Custom API Error class with status code and error code
 * Supports Nielsen Heuristic #9: Help users recognize, diagnose, and recover from errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Standardized error handler for API routes
 * Returns consistent error response format
 */
export function handleAPIError(error: unknown): NextResponse {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const fieldErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return NextResponse.json(
      {
        error: 'Dados inválidos. Por favor, verifique os campos e tente novamente.',
        code: 'VALIDATION_ERROR',
        details: fieldErrors,
      },
      { status: 400 }
    );
  }

  // Handle our custom API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  console.error('Unexpected API error:', error);
  
  return NextResponse.json(
    {
      error: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

// Pre-defined common errors for consistency
export const CommonErrors = {
  UNAUTHORIZED: new APIError(
    'Autenticação necessária. Por favor, faça login.',
    401,
    'AUTH_REQUIRED'
  ),
  FORBIDDEN: new APIError(
    'Você não tem permissão para acessar este recurso.',
    403,
    'FORBIDDEN'
  ),
  NOT_FOUND: new APIError(
    'Recurso não encontrado.',
    404,
    'NOT_FOUND'
  ),
  BAD_REQUEST: new APIError(
    'Requisição inválida.',
    400,
    'BAD_REQUEST'
  ),
} as const;
