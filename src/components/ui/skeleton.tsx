/**
 * Skeleton component
 * 
 * Reusable skeleton loading state component
 * Used for better UX during data loading
 */

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}

/**
 * TableRowSkeleton component
 * 
 * Skeleton for table rows - displays placeholder for cryptocurrency data
 */
export function TableRowSkeleton() {
  return (
    <tr className="border-b">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="w-5 h-5 rounded" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-20" />
      </td>
      <td className="p-4 hidden sm:table-cell">
        <Skeleton className="h-5 w-16" />
      </td>
      <td className="p-4 hidden md:table-cell">
        <Skeleton className="h-5 w-24" />
      </td>
    </tr>
  );
}

/**
 * TableSkeleton component
 * 
 * Full table skeleton with header and multiple rows
 */
export function TableSkeleton({ rowCount = 10 }: { rowCount?: number }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left min-w-[200px]">
              <Skeleton className="h-4 w-16" />
            </th>
            <th className="p-4 text-left min-w-[120px]">
              <Skeleton className="h-4 w-12" />
            </th>
            <th className="p-4 text-left hidden sm:table-cell min-w-[100px]">
              <Skeleton className="h-4 w-20" />
            </th>
            <th className="p-4 text-left hidden md:table-cell min-w-[120px]">
              <Skeleton className="h-4 w-24" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
