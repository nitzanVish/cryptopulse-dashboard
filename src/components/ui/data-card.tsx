/**
 * DataCard component
 * 
 * Reusable card wrapper component for data display with consistent structure.
 * Eliminates code duplication by providing a standard card layout with title.
 */

import { Card, CardContent, CardHeader, CardTitle } from './card';
import type { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  children: ReactNode;
}

/**
 * DataCard - Wrapper component for consistent card structure
 * 
 * Provides a standardized card layout with title and content area.
 * Used to eliminate repetition of Card + CardHeader + CardTitle pattern.
 * 
 * @example
 * <DataCard title="Top Cryptocurrencies">
 *   <Table>...</Table>
 * </DataCard>
 */
export function DataCard({ title, children }: DataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
