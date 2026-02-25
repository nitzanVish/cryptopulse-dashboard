import { Input } from '@/components/ui/input';
import { TEXT } from '@/constants/text';
import { Search } from 'lucide-react';
import type { SearchBarProps } from '@/types/components';

export function SearchBar({ 
  value,
  onChange, 
  placeholder = TEXT.search.placeholder 
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="pl-9"
        aria-label="Search cryptocurrencies"
      />
    </div>
  );
}
