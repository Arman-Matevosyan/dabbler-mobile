export function parseApiError(error: unknown): string {
  if (!error) return 'An unknown error occurred';

  if (typeof error === 'string') return error;

  if (error instanceof Error) return error.message;

  if (typeof error === 'object') {
    const errorObj = error as Record<string, any>;

    if (errorObj.message) return errorObj.message;
    if (errorObj.error) return errorObj.error;

    if (errorObj.errors && Array.isArray(errorObj.errors)) {
      return errorObj.errors[0] || 'Validation error';
    }

    if (errorObj.errors && typeof errorObj.errors === 'object') {
      const firstField = Object.keys(errorObj.errors)[0];
      if (firstField) {
        const fieldErrors = errorObj.errors[firstField];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          return fieldErrors[0];
        }
      }
      return 'Validation error';
    }

    if (errorObj.statusText) return errorObj.statusText;
  }

  return 'An unexpected error occurred';
}
