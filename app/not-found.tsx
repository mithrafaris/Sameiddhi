import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800">
            <SearchX className="h-12 w-12 text-violet-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">
          404 - Not Found
        </h1>
        
        <p className="text-sm text-zinc-400">
          We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
        </p>
        
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
