'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6 glass-card p-10 rounded-3xl border border-red-900/30 bg-red-950/10">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-red-900/20 border border-red-900/50 text-red-500">
            <AlertTriangle className="h-12 w-12" />
          </div>
        </div>
        
        <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">
          Something went wrong!
        </h1>
        
        <p className="text-xs text-zinc-400">
          An unexpected error occurred while processing your request. Please try again.
        </p>
        
        <div className="pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm font-semibold text-white transition-colors cursor-pointer w-full"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
