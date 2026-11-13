import { NextResponse } from 'next/server';
import { ApiError } from './errors';

// Converts any error into the same {error, code, details} JSON the backend uses.
export function errorResponse(error) {
  if (error instanceof ApiError) {
    const response = NextResponse.json(
      { error: error.message, code: error.status, details: error.details },
      { status: error.status || 500 },
    );
    if (error.retryAfter) response.headers.set('Retry-After', error.retryAfter);
    return response;
  }
  return NextResponse.json({ error: 'Unexpected server error', code: 500 }, { status: 500 });
}