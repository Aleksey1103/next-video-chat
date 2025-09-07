'use client';

import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Header({ className, ...props }: React.ComponentProps<'div'>) {
  const theme = useTheme();

  const { resolvedTheme, setTheme } = theme;

  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <header className={cn('flex items-center justify-between border-b-1 shadow-sm py-2 px-4', className)} {...props}>
      <Image src="/favicon.ico" width={36} height={36} alt="logo" />
      <div>V-chat</div>
      <Button variant="outline" size="icon" className="rounded-full" onClick={toggleTheme}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </header>
  );
}
