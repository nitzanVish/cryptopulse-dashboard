/**
 * Loading component
 * 
 * Reusable loading state component with spinner
 */

import { TEXT } from '@/constants/text';

export function Loading({ message = TEXT.loading.default }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-3 text-muted-foreground">{message}</span>
    </div>
  );
}
