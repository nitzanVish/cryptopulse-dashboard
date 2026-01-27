/**
 * EmptyState component
 * 
 * Reusable empty state component
 */

import { TEXT } from '@/constants/text';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = TEXT.emptyStates.noData }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
