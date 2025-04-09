import { Tooltip } from '@/components/ui/Tooltip';
import { parseApiError } from '@/utils/errorHandling';
import React, { createContext, useCallback, useContext, useState } from 'react';

type TooltipType = 'error' | 'warning' | 'success' | 'info';

type TooltipContextType = {
  showTooltip: (message: string, type?: TooltipType, duration?: number) => void;
  showError: (error: unknown, details?: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  hideTooltip: () => void;
};

const defaultTooltipContext: TooltipContextType = {
  showTooltip: () => {},
  showError: () => {},
  showSuccess: () => {},
  showWarning: () => {},
  showInfo: () => {},
  hideTooltip: () => {},
};

const TooltipContext = createContext<TooltipContextType>(defaultTooltipContext);

let lastTooltipContext: TooltipContextType | null = null;

export const useTooltip = () => useContext(TooltipContext);

export function getTooltipContext(): TooltipContextType {
  if (!lastTooltipContext) {
    console.warn('TooltipContext accessed before it was initialized');
    return defaultTooltipContext;
  }
  return lastTooltipContext;
}

type TooltipProviderProps = {
  children: React.ReactNode;
  defaultDuration?: number;
  defaultPosition?: 'top' | 'bottom';
};

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
  defaultDuration = 3000,
  defaultPosition = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<string | undefined>(undefined);
  const [tooltipType, setTooltipType] = useState<TooltipType>('info');
  const [duration, setDuration] = useState(defaultDuration);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
  }, []);

  const clearTooltipTimeout = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const showTooltip = useCallback(
    (message: string, type: TooltipType = 'info', duration?: number) => {
      clearTooltipTimeout();

      setMessage(message);
      setDetails(undefined);
      setTooltipType(type);
      setIsVisible(true);

      if (duration !== undefined) {
        setDuration(duration);
      } else {
        setDuration(defaultDuration);
      }

      if (duration !== 0 && defaultDuration !== 0) {
        const id = setTimeout(() => {
          hideTooltip();
        }, duration || defaultDuration);
        setTimeoutId(id);
      }
    },
    [clearTooltipTimeout, defaultDuration, hideTooltip]
  );

  const showError = useCallback(
    (error: unknown, details?: string, duration?: number) => {
      const errorMessage =
        typeof error === 'string' ? error : parseApiError(error);

      setMessage(errorMessage);
      setDetails(details);
      setTooltipType('error');
      setIsVisible(true);

      if (duration !== undefined) {
        setDuration(duration);
      } else {
        setDuration(defaultDuration);
      }

      clearTooltipTimeout();

      if (duration !== 0 && defaultDuration !== 0) {
        const id = setTimeout(() => {
          hideTooltip();
        }, duration || defaultDuration);
        setTimeoutId(id);
      }
    },
    [clearTooltipTimeout, defaultDuration, hideTooltip]
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showTooltip(message, 'success', duration);
    },
    [showTooltip]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showTooltip(message, 'warning', duration);
    },
    [showTooltip]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showTooltip(message, 'info', duration);
    },
    [showTooltip]
  );

  const contextValue = {
    showTooltip,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    hideTooltip,
  };

  lastTooltipContext = contextValue;

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
      <Tooltip
        message={message}
        visible={isVisible}
        type={tooltipType}
        duration={duration}
        position={defaultPosition}
        onClose={hideTooltip}
      />
    </TooltipContext.Provider>
  );
};
