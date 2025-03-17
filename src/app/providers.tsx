'use client';

import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from '@/contexts/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  // TODO: Should we separate providers configuration into different files?
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        {children}
        <Toaster />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
