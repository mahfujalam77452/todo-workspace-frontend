// One error type for every failed API call (server and browser).
export class ApiError extends Error {
  constructor(status, message, details = null, retryAfter = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.retryAfter = retryAfter;
  }
}

// Turns {details: {title: ["This field is required."]}} into {title: "This field is required."}
export function getFieldErrors(error) {
  const result = {};
  const details = error?.details;
  if (!details || typeof details !== 'object') return result;

  for (const [field, value] of Object.entries(details)) {
    result[field] = Array.isArray(value) ? String(value[0]) : String(value);
  }
  return result;
}

const FRIENDLY_MESSAGES = {
  0: 'Network error. Please check your connection.',
  401: 'Your session has expired. Please sign in again.',
  403: "You don't have permission to do this.",
  404: 'We could not find what you were looking for.',
  409: 'This action conflicts with the current data. Please refresh and try again.',
  413: 'The request is too large.',
  429: 'Too many requests. Please wait a moment and try again.',
  503: 'The service is busy. Please try again shortly.',
  504: 'The server is waking up. This can take up to a minute, please try again.',
};

// Statuses where the backend message is specific and useful to show as it is.
const SHOW_BACKEND_MESSAGE = [400, 403, 409];

export function getErrorMessage(error) {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  if (SHOW_BACKEND_MESSAGE.includes(error.status) && error.message) return error.message;
  return FRIENDLY_MESSAGES[error.status] || 'Something went wrong. Please try again.';
}