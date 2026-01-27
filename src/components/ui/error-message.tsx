/**
 * ErrorMessage component
 * 
 * Reusable error state component
 */

import { TEXT } from '@/constants/text';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  error?: unknown;
}

export function ErrorMessage({ 
  title = TEXT.errors.loadingData, 
  message,
  error 
}: ErrorMessageProps) {
  const errorMessage = message || 
    (error && typeof error === 'object' && 'status' in error 
      ? `Error: ${error.status}` 
      : TEXT.errors.fetchFailed);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <p className="text-destructive font-medium">{title}</p>
        <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
      </div>
    </div>
  );
}
