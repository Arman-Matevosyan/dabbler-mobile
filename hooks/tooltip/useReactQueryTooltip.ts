import { getTooltipContext, useTooltip } from '@/contexts/TooltipContext';
import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: string[] | Record<string, string[]>;
  [key: string]: unknown;
}

export function extractErrorDetails(error: unknown): {
  message: string;
  details?: string;
} {

  let message = 'An unknown error occurred';
  let details: string | undefined = undefined;

  if (!error) {
    return { message };
  }
  if (typeof error === 'string') {
    return { message: error };
  }

  if (error instanceof AxiosError || (error as any)?.isAxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status;

    if (status === 404) {
      message = 'Resource not found. The requested item does not exist.';
    } else if (status === 403) {
      message = 'Permission denied. You do not have access to this resource.';
    } else if (status === 401) {
      message = 'Authentication required. Please log in to continue.';
    } else if (status === 400) {
      try {
        const data = axiosError.response?.data;
        if (data && typeof data === 'object') {
          if ('message' in data && data.message) message = String(data.message);
          if ('error' in data && data.error) message = String(data.error);
        }
        if (typeof data === 'string') message = data;
      } catch (e) {}
      message = message || 'Invalid request. Please check your inputs.';
    } else if (status && status >= 500) {
      message = 'Server error. Please try again later.';
    } else if (
      axiosError.response?.data &&
      typeof axiosError.response.data === 'object' &&
      'message' in axiosError.response.data &&
      axiosError.response.data.message
    ) {
      message = String(axiosError.response.data.message);
    } else {
      message = axiosError.message || 'A network error occurred';
    }

    try {
      if (axiosError.response?.data) {
        if (typeof axiosError.response.data === 'string') {
          details = axiosError.response.data;
        } else {
          details = JSON.stringify(axiosError.response.data, null, 2);
        }
      }
    } catch (e) {
      console.error('Error parsing response data:', e);
    }

    return { message, details };
  }

  if (error instanceof Error) {
    message = error.message;
    details = error.stack;
    return { message, details };
  }

  try {
    message = 'Error occurred';
    details = JSON.stringify(error, null, 2);
    return { message, details };
  } catch {
    return { message };
  }
}

export function extractErrorMessage(error: unknown): string {
  return extractErrorDetails(error).message;
}

export function showErrorTooltip(error: unknown): void {
  try {
    const tooltipContext = getTooltipContext();
    const { message, details } = extractErrorDetails(error);

    tooltipContext.showError(message, details);
  } catch (e) {
    console.error('Failed to show error tooltip:', e);
  }
}

export function useQueryErrorTooltip(error: unknown) {
  const { showError } = useTooltip();
  const errorShownRef = useRef(false);

  useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;

      const { message, details } = extractErrorDetails(error);
      showError(message, details);

      setTimeout(() => {
        errorShownRef.current = false;
      }, 2000);
    }
  }, [error, showError]);
}

export function useMutationErrorTooltip(error: unknown) {
  const { showError } = useTooltip();
  const errorShownRef = useRef(false);

  useEffect(() => {
    if (error && !errorShownRef.current) {
      errorShownRef.current = true;

      const { message, details } = extractErrorDetails(error);
      showError(message, details);

      setTimeout(() => {
        errorShownRef.current = false;
      }, 2000);
    }
  }, [error, showError]);
}

export const useReactQueryTooltip = {
  useQueryErrorTooltip,
  useMutationErrorTooltip,
  showErrorTooltip,
  extractErrorMessage,
  extractErrorDetails,
};

export default useReactQueryTooltip;
